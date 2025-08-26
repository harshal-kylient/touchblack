import { useState, useRef, useCallback, useEffect } from 'react';
import { View, StatusBar, Animated, SafeAreaView, LayoutChangeEvent, Pressable, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IMainStackParams } from '..';
import { useAuth } from '@presenters/auth/AuthContext';
import ProfilePlaceholder from '@components/loaders/ProfilePlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import TalentProfileHeader from './screenComponents/TalentProfileHeader';
import Header from '@components/Header';
import ProfileHeader from '@components/ProfileHeader';
import TalentShowReel from './Tabs/TalentShowReel';
import TalentAbout from './Tabs/TalentAbout';
import TalentOtherWork from './Tabs/TalentOtherWork';
import { Button, Text } from '@touchblack/ui';
import SearchedTalentProfileHeader from './screenComponents/SearchedTalentProfileHeader';
import { useNavigation } from '@react-navigation/native';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useQueryClient } from '@tanstack/react-query';
import { useFilterContext } from './Tabs/FilterContext';
import { Error } from '@touchblack/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import useGetManagerTalents from '@network/useGetManagerTalents';
interface IProps extends NativeStackScreenProps<IMainStackParams, 'TalentProfile'> {}

function TalentProfile({ route }: IProps) {
	const id = route.params?.id;
	const headerType = route?.params?.type;
	const { styles, theme } = useStyles(stylesheet);
	const { userId, loginType } = useAuth();
	const talentId = id || userId;
	const myprofile = talentId === userId;
	const contentHeight = useRef<number>(0);
	const screenHeight = useRef<number>(0);
	const [activeTab, setActiveTab] = useState(0);
	const queryClient = useQueryClient();
	const { dispatch } = useFilterContext();
	const { data: talentAbout, isLoading } = useGetUserDetailsById('User', talentId);
	const navigation = useNavigation();
	const [paddingBottom, setPaddingBottom] = useState(0);
	const insets = useSafeAreaInsets();
	const { subscriptionData } = useSubscription();
	const { data: managerTalents } = useGetManagerTalents('active');
	const managerTalent = managerTalents?.data?.manager_talents ?? [];
	const talentUserIds = managerTalent.map(item => item.talent.user_id?.trim().toLowerCase());
	const cleanedTalentId = id?.trim().toLowerCase();
	const isMatching = talentUserIds.includes(cleanedTalentId);

	useEffect(() => {
		return () => dispatch({ type: 'RESET_FILTERS' });
	}, [dispatch]);

	const handleContentSizeChange = useCallback((height: number) => {
		contentHeight.current = height;
	}, []);

	const handleLayout = useCallback((event: LayoutChangeEvent) => {
		const { height } = event.nativeEvent.layout;
		screenHeight.current = height;
	}, []);

	const [serverError, setServerError] = useState({ success: false, message: '' });

	const handleClaimButtonPress = useCallback(async () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: 'Warning !',
					icon: Error,
					text: 'Looks like you’re ready to claim this profile! Just a quick note: if the claim turns out to be incorrect, we will have to suspend your account forever. Let’s make sure it’s all good!',
					onPress: handleClaimAccountPress,
				},
			},
		});
	}, []);

	const handleClaimAccountPress = useCallback(async () => {
		try {
			const response = await server.post(CONSTANTS.endpoints.claim(id));
			const aadhar = response.data?.data?.aadhar_number;

			if (aadhar) {
				const res = await server.post(CONSTANTS.endpoints.aadhar_get_otp, { aadhar_number: aadhar });
				if (!res.data?.success) {
					setServerError({ success: false, message: 'Something Went Wrong' });
					return;
				}
				navigation.navigate('AadharOTP', { id, aadhar });
			} else if (response.status === 404) {
				navigation.navigate('ClaimAccount', { id });
			} else {
				setServerError({ success: response.status === 200, message: response.data?.message });
			}
		} catch (error) {
			setServerError({ success: false, message: 'An error occurred' });
		}
	}, [id, navigation]);

	const handleAddFilmPopUp = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.PROFILE_ADD_FILM];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			handleAddFilm();
		}
	};

	const handleClaimAccountPopUp = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.CLAIM_ACCOUNT];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			handleClaimButtonPress();
		}
	};

	const handleAddFilm = () => {
		navigation.navigate('AddFilm', { type: 'talent', onSuccess: () => queryClient.invalidateQueries({ queryKey: ['useGetShowreelsOtherWorks', talentId] }) });
	};

	const updateTalentProfile = useCallback(() => {
		navigation.navigate('UpdateTalentProfile');
	}, [navigation]);

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
		<SafeAreaView style={[styles.container, { marginBottom: -insets.bottom }]}>
			<Animated.ScrollView bounces={false} onContentSizeChange={handleContentSizeChange} onLayout={handleLayout} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
				<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
				<Header name="Profile" main={!myprofile}>
					{headerType === 'managerTalent' ? <ProfileHeader id={talentId} type="User" role="managerTalent" /> : <ProfileHeader id={talentId} type="User" />}
				</Header>

				{myprofile ? <TalentProfileHeader talentId={talentId} /> : <SearchedTalentProfileHeader talentId={talentId} />}
				<View style={{ paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Pressable
						onPress={() => {
							setServerError({ success: false, message: '' });
							setActiveTab(0);
						}}
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.transparent,
							borderTopWidth: theme.borderWidth.slim,
							borderRightWidth: theme.borderWidth.slim,
							borderLeftWidth: theme.borderWidth.slim,
							borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent,
							paddingVertical: theme.padding.xs,
							position: 'relative',
						}}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
							Showreel
						</Text>
						<View style={styles.absoluteContainer(activeTab === 0)} />
					</Pressable>
					<Pressable
						onPress={() => {
							setServerError({ success: false, message: '' });
							setActiveTab(1);
						}}
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.transparent,
							borderTopWidth: theme.borderWidth.slim,
							borderRightWidth: theme.borderWidth.slim,
							borderLeftWidth: theme.borderWidth.slim,
							borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent,
							paddingVertical: theme.padding.xs,
							position: 'relative',
						}}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
							About
						</Text>
						<View style={styles.absoluteContainer(activeTab === 1)} />
					</Pressable>
				</View>
				{activeTab === 0 && <TalentShowReel paddingBottom={paddingBottom} talentId={talentId} />}
				{activeTab === 1 && <TalentAbout paddingBottom={paddingBottom} talentId={talentId} />}
			</Animated.ScrollView>
			<View onLayout={event => setPaddingBottom(event.nativeEvent.layout.height)} style={styles.absolute(myprofile)}>
				<Pressable onPress={() => setServerError({ success: false, message: '' })} style={styles.errorView(serverError.success, serverError.message)}>
					<Text size="bodyMid" style={styles.errorText(serverError.success)}>
						{serverError.message}
					</Text>
				</Pressable>
				<View style={styles.buttonContainer}>
					{(myprofile || (loginType === 'manager' && isMatching)) && activeTab === 0 ? (
						<Button onPress={handleAddFilmPopUp} textColor="black" type="primary" style={styles.button}>
							Add New Film
						</Button>
					) : null}
					{(myprofile || (loginType === 'manager' && isMatching)) && activeTab === 1 ? (
						<Button onPress={updateTalentProfile} textColor="primary" type="secondary" style={styles.button}>
							Edit
						</Button>
					) : null}
					{/* {(myprofile || (loginType === 'manager' && isMatching)) && activeTab === 2 ? (
						<Button onPress={handleAddShowReelPopUp} textColor="black" type="primary" style={styles.button}>
							Add New Film
						</Button>
					) : null} */}
					{!myprofile && loginType === 'talent' && !talentAbout?.is_claimed ? (
						<Button onPress={handleClaimAccountPopUp} style={styles.button}>
							Claim Account
						</Button>
					) : null}
				</View>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	absolute: (myprofile: boolean) => ({
		position: 'absolute',
		bottom: 20,
		
		flex: 1,
		backgroundColor: theme.colors.black,
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	}),
	loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	buttonContainer: {
		width: '100%',
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.base,
	},
	button: {
		flexGrow: 1,
		marginTop: theme.padding.xs,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
		
	},
	errorText: (serverError: any) => ({
		color: !serverError ? theme.colors.destructive : theme.colors.success,
		padding: 8,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
	}),
	errorView: (serverError: any, message: any) => ({
		flex: 1,
		minHeight: 32,
		display: message ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: !serverError ? theme.colors.destructive : theme.colors.success,
	}),
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		zIndex: 1,
	},
	loader: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	extraPadding: {
		flex: 1,
		backgroundColor: '#000',
		height: 300,
	},
}));

export default TalentProfile;
