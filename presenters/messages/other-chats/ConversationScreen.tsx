import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, Pressable, SafeAreaView, StatusBar, View, TextInput, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, TouchableOpacity, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ArrowUp, Person, Send, Triangle } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import Header from '@components/Header';
import moment from 'moment';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetAllMessages from '@network/useGetAllMessages';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import IMessage from '@models/entities/IMessage';
import { formatTimestampForDay } from '@utils/formatTimestampForDay';
import { useStudioContext } from '@presenters/studio/StudioContext';
import useSentByMe from '../project-chats/useSentByMe';
import IMessageItem from '@models/entities/IMessageItem';

interface IMessageInternal {
	message_id: UniqueId;
	sender_id: UniqueId;
	content: string;
	created_at: string;
	message_reads: [];
}

export default function ConversationScreen({ route }: { route: any }) {
	const [id, setId] = useState(route.params?.id);
	const { userId, producerId, loginType, permissions } = useAuth();
	const { studioFloor } = useStudioContext();
	const myId = loginType === 'producer' ? producerId : loginType === 'studio' ? studioFloor?.id : userId;
	const receiver_id = route.params?.receiver_id;
	const receiver_type = route.params?.receiver_type;
	const name = route.params?.name;
	const picture = route.params?.picture;
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { data: response, isLoading, hasNextPage, fetchNextPage, refetch } = useGetAllMessages(id);
	const data = response?.messages?.reverse();
	const [inputText, setInputText] = useState('');
	const [inputHeight] = useState(48);
	const queryClient = useQueryClient();
	const listRef = useRef<FlatList>();
	const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

	useEffect(() => {
		(async () => {
			if (data) {
				setTimeout(() => listRef.current.scrollToEnd({ animated: true }), 200);
			}

			const response = await server.post(CONSTANTS.endpoints.create_conversation(myId!, myId!, receiver_id));

			if (!response.data?.success) {
				return;
			} else {
				setId(response.data?.data?.id);
			}
		})();
	}, [myId, data, receiver_id]);

	useEffect(() => {
		const timer = setInterval(refetch, 7000);
		return () => clearInterval(timer);
	}, [refetch]);

	useEffect(() => {
		(async () => {
			if (id && data) {
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
	}, [data, id, myId]);

	/*function handleInputHeight(e) {
		setInputHeight(e.nativeEvent.contentSize.height);
	}*/

	async function sendMessage(conversation_id: UniqueId) {
		const response2 = await server.post(CONSTANTS.endpoints.send_message(conversation_id, myId!, inputText.trim()));

		if (!response2.data?.success) {
			return;
		}

		setInputText('');
		Keyboard.dismiss();
		queryClient.invalidateQueries(['useGetAllMessages', conversation_id]);
	}

	async function handleSendMessage() {
		if (!inputText.trim()) {
			return;
		} else if (inputText.length > 4096) {
			return;
		}
		sendMessage(id);
	}

	const handleProfileNavigation = () => {
		navigation.navigate(receiver_type === 'User' ? 'TalentProfile' : 'ProducerProfile', { id: receiver_id });
	};

	const keyboard = useAnimatedKeyboard();
	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboard.height.value }],
	}));

	const active = loginType === 'producer' ? permissions?.includes('Messages::Edit') : true;

	function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
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
	}

	const handleScrollToBottom = () => {
		listRef.current?.scrollToEnd();
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Pressable onPress={handleProfileNavigation} style={{ backgroundColor: theme.colors.backgroundDarkBlack, zIndex: 99 }}>
				<Header name={name || ''}>
					<View>{picture ? <Image src={picture} resizeMode="cover" style={{ flex: 1, height: 24, width: 24, aspectRatio: 1 }} /> : <Person width={24} height={24} />}</View>
				</Header>
			</Pressable>
			<Animated.FlatList ref={listRef} bounces={false} scrollEventThrottle={200} data={data} renderItem={({ item, index }) => <MessageItem item={item} index={index} data={data} />} contentContainerStyle={styles.messagesList} style={[{ marginBottom: !active ? 0 : Platform.OS === 'android' ? inputHeight + 40 : inputHeight }, animatedStyles]} keyExtractor={it => it.message_id} scrollEnabled={true} onEndReachedThreshold={0.5} showsVerticalScrollIndicator={true} />
			{active && (
				<Animated.View style={[styles.inputContainer, animatedStyles]}>
					<TextInput placeholderTextColor={theme.colors.muted} multiline placeholder="Type message..." style={styles.input(inputHeight)} value={inputText} onChangeText={setInputText} />
					<TouchableOpacity onPress={handleSendMessage} style={styles.button}>
						<Send width={24} height={24} color={theme.colors.typography} />
					</TouchableOpacity>
				</Animated.View>
			)}
			{showScrollBottomBtn ? (
				<Pressable onPress={handleScrollToBottom} style={{ position: 'absolute', bottom: 25 + inputHeight, right: 15, elevation: 8, shadowRadius: 4, padding: theme.padding.xxs, backgroundColor: theme.colors.backgroundLightBlack }}>
					<ArrowUp size="24" style={{ transform: [{ scaleY: -1 }] }} />
				</Pressable>
			) : null}
		</SafeAreaView>
	);
}

/*function formatTimeForChat(date: string) {
	const format = 'MMM DD, HH:mm';
	return moment(date).format(format);
}*/

function MessageItem({ item, index, data }: { item: IMessageItem; index: number; data: IMessageInternal[] }) {
	const [showReadAt, setShowReadAt] = useState<boolean>(false);
	const { styles, theme } = useStyles(stylesheet);
	const sentByMe = useSentByMe(item);

	const handleShowRead = useCallback(() => {
		if (sentByMe) {
			return;
		}
		setShowReadAt(prev => !prev);
	}, [sentByMe]);

	return (
		<>
			{moment(data[index - 1]?.created_at).format('YYYY-MM-DD') !== moment(item?.created_at).format('YYYY-MM-DD') && (
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.sm }}>
					<View style={{ height: 0.5, flex: 1, backgroundColor: theme.colors.muted }} />
					<Text size="bodyMid" color="regular">
						{formatTimestampForDay(item?.created_at)}
					</Text>
					<View style={{ height: 0.5, flex: 1, backgroundColor: theme.colors.muted }} />
				</View>
			)}
			<Pressable onPress={handleShowRead} style={styles.messageContainer(sentByMe)}>
				<View style={styles.contentContainer}>
					<Text size="primarySm" color="regular" style={styles.messageText(sentByMe)}>
						{item.content}
					</Text>
				</View>
				<View style={styles.senderContainer}>
					<Text size="bodyMid" color="regular" style={styles.sender(sentByMe)}>
						{item.sender_name}
					</Text>
				</View>
				<Triangle size="12" color={sentByMe ? theme.colors.backgroundDarkBlack : theme.colors.backgroundLightBlack} strokeColor={theme.colors.muted} style={{ position: 'absolute', bottom: -12, right: sentByMe ? 0 : undefined, left: sentByMe ? undefined : 0, transform: [{ scaleX: sentByMe ? 1 : -1 }] }} />
			</Pressable>
			{showReadAt && (
				<Text size="primarySm" style={{ textAlign: 'right', marginVertical: 8, color: theme.colors.success }}>
					Read {moment(item.message_reads[0]).format('HH:MM')}
				</Text>
			)}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	contentContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
	},
	senderContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	sender: (sentByMe: boolean) => ({
		textAlign: sentByMe ? 'right' : 'left',
		color: theme.colors.success,
		fontFamily: theme.fontFamily.cgBold,
		fontWeight: theme.fontWeight.bold,
	}),
	messagesList: {
		paddingHorizontal: theme.padding.base,
	},
	messageContainer: (isMe: boolean) => ({
		alignSelf: isMe ? 'flex-end' : 'flex-start',
		backgroundColor: isMe ? theme.colors.black : theme.colors.backgroundLightBlack,
		marginVertical: theme.margins.xs,
		maxWidth: '80%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	messageText: (sentByMe: boolean) => ({
		textAlign: sentByMe ? 'right' : 'left',
	}),
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
