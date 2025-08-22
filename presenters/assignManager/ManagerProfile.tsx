import { useState, useRef, useCallback } from 'react';
import { View, StatusBar, SafeAreaView, LayoutChangeEvent, Pressable, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IMainStackParams } from '..';
import { useAuth } from '@presenters/auth/AuthContext';
import ProfilePlaceholder from '@components/loaders/ProfilePlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import Header from '@components/Header';
import ProfileHeader from '@components/ProfileHeader';
import { Text } from '@touchblack/ui';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TalentProfileHeader from '@presenters/talentProfile/screenComponents/TalentProfileHeader';
import { FlashList } from '@shopify/flash-list';
import UserItem from '@components/UserItem';
import CONSTANTS from '@constants/constants';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import useGetManagerTalents from '@network/useGetManagerTalents';
import { NoTalentAssignedSvg } from '@assets/svgs/errors';

interface IProps extends NativeStackScreenProps<IMainStackParams, 'TalentProfile'> {}

function ManagerProfile({ route }: IProps) {
	const id = route.params?.id;
	const { styles, theme } = useStyles(stylesheet);
	const { userId, setAuthInfo } = useAuth();
	const managerId = id || userId;
	const myprofile = managerId === userId;

	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const [activeTab, setActiveTab] = useState(0);
	const [paddingBottom, setPaddingBottom] = useState(0);

	const { data: talentAbout, isLoading } = useGetUserDetailsById('User', managerId);
	const { data: managerTalents, isFetching, refetch, isRefetching } = useGetManagerTalents('active');
	const managerTalent = managerTalents?.data?.manager_talents;
	const [serverError, setServerError] = useState({ success: false, message: '' });

	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [refetch]),
	);

	const handleTalents = async item => {
		// console.log("function is being called", 	JSON.stringify(item))
		// if (!item?.talent?.is_subscription_valid) {
		// 	const talentId = item?.talent?.user_id;
		// 	const url = `${endpoints.subscription_restriction(CONSTANTS.POPUP_TYPES.MANAGER_TALENT_ACCESS)}&talent_id=${talentId}`;
		// 	const response = await server.get(url);
		// 	const restriction = response.data;

		// 	if (restriction?.data?.popup_configuration) {
		// 		SheetManager.show('Drawer', {
		// 			payload: {
		// 				sheet: SheetType.SubscriptionRestrictionPopup,
		// 				data: restriction.data.popup_configuration,
		// 			},
		// 		});
		// 	}
		// } else {
		setAuthInfo({
			managerTalentId: item?.talent?.user_id,
		});
		navigation.navigate('TalentProfile', { id: item?.talent?.user_id, type: 'managerTalent' });
		// }
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loader}>
				<ProfilePlaceholder />
				<TabsPlaceholder />
				<SearchBarPlaceholder />
				<LargeGridPlaceholder />
				<LargeGridPlaceholder />
				<TextPlaceholder customWidth={UnistylesRuntime.screen.width - 32} customHeight={48} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={[styles.container, { marginBottom: -insets.bottom, flex: 1 }]}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />

			<Header name="Profile" main={!myprofile}>
				<ProfileHeader id={managerId} type="User" role="manager" />
			</Header>

			<TalentProfileHeader talentId={managerId} />

			<View style={styles.tabContainer}>
				<View style={styles.tab(activeTab === 0)}>
					<Text size="button" color={activeTab === 0 ? 'primary' : 'regular'}>
						Clients
					</Text>
				</View>
			</View>
			{isRefetching && (
				<View style={{ paddingVertical: theme.padding.base }}>
					<ActivityIndicator size="small" color={theme.colors.muted} />
				</View>
			)}
			<FlashList
				data={managerTalent}
				contentContainerStyle={styles.talentsView}
				renderItem={({ item }) => <UserItem name={`${item?.talent?.first_name || ''} ${item?.talent?.last_name || ''}`} id={item?.talent?.user_id} profession={item?.talent?.talent_role} onPress={() => handleTalents(item)} image={createAbsoluteImageUri(item.talent.profile_picture_url)} />}
				refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
				keyExtractor={item => item?.id || ''}
				estimatedItemSize={64}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<NoTalentAssignedSvg />
					</View>
				}
			/>

			<View onLayout={event => setPaddingBottom(event.nativeEvent.layout.height)} style={styles.absolute(myprofile)}>
				<Pressable onPress={() => setServerError({ success: false, message: '' })} style={styles.errorView(serverError.success, serverError.message)}>
					<Text size="bodyMid" style={styles.errorText(serverError.success)}>
						{serverError.message}
					</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	loader: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	tabContainer: {
		paddingHorizontal: theme.padding.xs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tab: (active: boolean) => ({
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: active ? theme.colors.borderGray : theme.colors.transparent,
		paddingVertical: theme.padding.xs,
	}),
	talentsView: {
		paddingBottom: theme.padding.base * 2.5,
		paddingTop: theme.padding.base * 1.5,
	},
	emptyState: {
		flex: 1,
		height: (5.5 * CONSTANTS.screenHeight) / 10,
		justifyContent: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	absolute: (myprofile: boolean) => ({
		position: 'absolute',
		bottom: myprofile ? 0 : Platform.OS === 'android' ? 0 : 20,
		paddingBottom: theme.padding.base,
		width: '100%',
		backgroundColor: theme.colors.black,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	}),
	errorView: (success: boolean, message: string) => ({
		minHeight: 32,
		display: message ? 'flex' : 'none',
		borderTopWidth: 1,
		borderColor: success ? theme.colors.success : theme.colors.destructive,
	}),
	errorText: (success: boolean) => ({
		color: success ? theme.colors.success : theme.colors.destructive,
		padding: 8,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
	}),
}));

export default ManagerProfile;
