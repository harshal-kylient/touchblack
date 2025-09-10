import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Keyboard, Pressable, Text as RNText, SafeAreaView, StatusBar, View, TextInput, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ArrowUp, LongArrowLeft, Person, Send } from '@touchblack/icons';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import useGetAllMessages from '@network/useGetAllMessages';
import { useNavigation } from '@react-navigation/native';
import { darkTheme } from '@touchblack/ui/theme';
import ProjectConversationRenderItem from './ProjectConversationRenderItem';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import IMessageItem from '@models/entities/IMessageItem';
import { Text } from '@touchblack/ui';
import EnumStatus from '@models/enums/EnumStatus';
import capitalized from '@utils/capitalized';

export default function ProjectConversation({ route }) {
	// Route Params
	const project_id = route.params?.project_id;
	const conversation_id = route.params?.id;
	const receiver_id_param = route.params?.receiver_id;

	const { userId, producerId, loginType, permissions } = useAuth();
	const myId = useMemo(() => (loginType === 'producer' ? producerId : userId), [loginType, producerId, userId]);
	const navigation = useNavigation();

	const { styles, theme } = useStyles(stylesheet);
	const [loading, setLoading] = useState(false);

	const { data: response, refetch, isLoading, hasNextPage, fetchNextPage } = useGetAllMessages(conversation_id, project_id);

	// Derived data from network call
	const data = response?.messages?.reverse() as IMessageItem[];
	const status = response?.metadata?.invitation_status;
	const last_negotiation_id = response?.metadata?.last_negotiation_id;
	const last_negotiation_status = response?.metadata?.last_negotiation_status;
	const receiver_id = response?.metadata?.reciever_data?.reciever_id || receiver_id_param;
	const name = response?.metadata?.project_name; // Project Name
	const party1Id = loginType === 'talent' ? userId : response?.metadata?.reciever_data?.reciever_id;
	const party2Id = loginType === 'producer' ? producerId : response?.metadata?.reciever_data?.reciever_id;
	const owner_profile_picture = response?.metadata?.reciever_data?.reciever_profile_picture;
	const owner_name = response?.metadata?.reciever_data?.reciever_name;
	const project_invitation_id = response?.metadata?.project_invitation_id;

	const [inputText, setInputText] = useState<string>('');
	const [inputHeight] = useState<number>(48);
	const queryClient = useQueryClient();

	const listRef = useRef<FlatList>(null);
	const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
	const active = (loginType === 'producer' ? permissions?.includes('Project::Edit') : true) && status !== EnumStatus.Opted_out;

	useEffect(() => {
		const timer = setInterval(refetch, 4000);
		return () => clearInterval(timer);
	}, [refetch]);

	useEffect(() => {
		(async () => {
			try {
				if (data?.length) {
					setTimeout(() => {
						listRef?.current?.scrollToEnd({ animated: true });
					}, 200);
				}
			} catch (error) {
				setLoading(false);
			}
		})();
	}, [data]);
	useEffect(() => {
		(async () => {
			if (conversation_id && data) {
				try {
					const messageIds = data[data.length - 1].message_id;
					const url = CONSTANTS.endpoints.mark_message_read(myId!, messageIds);
					const response = await server.postForm(url);
					return response;
				} catch (error) {
					console.error('API error:', error);
				}
			}
		})();
	}, [data, conversation_id, myId]);

	const sendMessage = useCallback(
		async (conversation_id: UniqueId) => {
			const response2 = await server.post(CONSTANTS.endpoints.send_message(conversation_id, myId!, inputText.trim()));
			if (response2.data?.success) {
				setInputText('');
				Keyboard.dismiss();
				await queryClient.invalidateQueries(['useGetAllMessages', conversation_id, myId!, undefined, project_id]);
				listRef.current?.scrollToEnd();
			}
		},
		[inputText, myId, queryClient],
	);

	const handleSendMessage = useCallback(() => {
		if (inputText.trim() && inputText.length <= 4096) {
			sendMessage(conversation_id);
		}
	}, [inputText, conversation_id, sendMessage]);

	const handleProfileNavigation = useCallback(() => {
		if (loginType === 'producer') {
			navigation.navigate('TalentProfile', { id: receiver_id });
		}
	}, [loginType, navigation, receiver_id]);

	const handleScroll = useCallback(
		(event: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offset = event.nativeEvent.contentOffset.y;
			const visibleLength = event.nativeEvent.layoutMeasurement.height;
			const contentLength = event.nativeEvent.contentSize.height;

			if (offset <= 0) {
				if (!isLoading && hasNextPage) {
					fetchNextPage();
				}
			}
			const isCloseToBottom = offset + visibleLength >= contentLength - 30;
			setShowScrollBottomBtn(!isCloseToBottom);
		},
		[fetchNextPage, hasNextPage, isLoading],
	);

	const handleScrollToBottom = useCallback(() => {
		listRef.current?.scrollToEnd();
	}, []);

	const keyboard = useAnimatedKeyboard();
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboard.height.value }],
	}));

	if (isLoading || loading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
				<ActivityIndicator color={theme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={{ backgroundColor: theme.colors.backgroundDarkBlack, flexDirection: 'row', paddingTop: theme.padding.xxs, zIndex: 9999, minWidth: '100%' }}>
				<Pressable onPress={navigation.goBack} style={{ padding: theme.padding.base, marginTop: -12 }}>
					<LongArrowLeft size="24" />
				</Pressable>
				<Pressable onPress={handleProfileNavigation} style={{ backgroundColor: theme.colors.backgroundDarkBlack, zIndex: 99, flex: 1, justifyContent: 'center' }}>
					<View style={{ flexDirection: 'column', backgroundColor: theme.colors.backgroundDarkBlack, justifyContent: 'space-between', paddingRight: darkTheme.padding.base, paddingBottom: darkTheme.padding.xs }}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<View>
								<RNText style={{ fontFamily: darkTheme.fontFamily.cgMedium, fontSize: darkTheme.fontSize.primaryH2, color: darkTheme.colors.typography }}>{capitalized(name)}</RNText>
								{owner_name ? (
									<Text size="bodyBig" color="muted">
										{owner_name}
									</Text>
								) : null}
							</View>
							{owner_profile_picture ? <Image source={{ uri: owner_profile_picture }} resizeMode="cover" style={{ flex: 1, maxHeight: 30, maxWidth: 30, aspectRatio: 1 }} /> : <Person width={30} height={30} />}
						</View>
					</View>
				</Pressable>
			</View>
			<Animated.FlatList
				ref={listRef}
				bounces={false}
				scrollEventThrottle={200}
				data={data}
				style={[{ marginBottom: active ? (Platform.OS === 'android' ? inputHeight + 40 : inputHeight) : 0 }, animatedStyles]}
				renderItem={({ item, index }) => <ProjectConversationRenderItem last_negotiation_status={last_negotiation_status} last_negotiation_id={last_negotiation_id} party2_id={party2Id} party1_id={party1Id} conversation_id={conversation_id} status={status} project_id={project_id} project_invitation_id={project_invitation_id} item={item} index={index} data={data} />}
				keyExtractor={(item, index) => item?.message_id || String(index)}
			/>
			{active && (
				<Animated.View style={[styles.inputContainer, animatedStyles]}>
					<TextInput placeholderTextColor={theme.colors.muted} multiline placeholder="Type message..." style={styles.input(inputHeight)} value={inputText} onChangeText={setInputText} />
					<TouchableOpacity onPress={handleSendMessage} style={styles.button}>
						<Send width={24} height={24} color={theme.colors.typography} />
					</TouchableOpacity>
					{showScrollBottomBtn && (
						<Pressable onPress={handleScrollToBottom} style={{ position: 'absolute', bottom: 25 + inputHeight, right: 15, elevation: 8, shadowRadius: 4, padding: theme.padding.xxs, backgroundColor: theme.colors.backgroundLightBlack }}>
							<ArrowUp size="24" style={{ transform: [{ scaleY: -1 }] }} />
						</Pressable>
					)}
				</Animated.View>
			)}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	messagesList: {
		paddingHorizontal: theme.padding.base,
	},
	messageContainer: (isMe: boolean) => ({
		alignSelf: isMe ? 'flex-end' : 'flex-start',
		backgroundColor: isMe ? '#50483B' : theme.colors.backgroundLightBlack,
		marginVertical: theme.margins.xs,
		maxWidth: '80%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	messageText: {
		// color: theme.colors.typography,
	},
	timestamp: {
		color: theme.colors.muted,
		fontSize: 10,
		alignSelf: 'flex-start',
		marginTop: 4,
	},
	inputContainer: {
		paddingVertical: 6,
		paddingLeft: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		marginBottom: theme.margins.base,
	},
	input: (height: number) => ({
		height,
		color: theme.colors.typography,
		flex: 1,
	}),
	button: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		...Platform.select({
			android: {
				justifyContent: 'center',
			},
			ios: {
				paddingTop: 4,
				justifyContent: 'flex-start',
			},
		}),
		alignItems: 'center',
		width: 48,
		height: 48,
	},
}));
