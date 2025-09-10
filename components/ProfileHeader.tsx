import { Alert, Platform, Pressable, Share, ToastAndroid, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';

import { Block, Menu as MenuIcon, Report, Settings, Calendar, Share as ShareIcon, Mail, Add } from '@touchblack/icons';
import { MenuOption, MenuOptions, Menu, MenuTrigger } from 'react-native-popup-menu';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { SheetType } from 'sheets';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import formatName from '@utils/formatName';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { ViewType, useProjectsContext } from '@presenters/projects/ProjectContext';
import EnumReportType from '@models/enums/EnumReportType';
import CONSTANTS from '@constants/constants';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

interface IProps {
	id: UniqueId;
	type: 'User' | 'Producer';
	role: string;
}

const ProfileHeader = memo(({ id, type, role }: IProps) => {
	const navigation = useNavigation();
	const profession = role;
	const { userId, producerId, loginType, permissions } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const reporterId = loginType === 'producer' ? producerId : userId;
	const { styles, theme } = useStyles(stylesheet);
	const { data: talentData } = useGetUserDetailsById(type, id);
	const { data: myData } = useGetUserDetailsById(loginType === 'talent' ? 'User' : 'Producer', loginType === 'talent' ? userId! : producerId!);
	const { dispatch } = useProjectsContext();
	const { subscriptionData } = useSubscription();

	const handleAddToProject = useCallback(() => {
		dispatch({ type: 'ACTIVE_VIEW', value: ViewType.LIST });
		dispatch({ type: 'ADD_TO_PROJECT', value: { talent_id: id, profession_id: talentData?.profession_type, profession_name: talentData?.talent_role } });
		navigation.navigate('TabNavigator', { screen: 'Projects' });
	}, [navigation]);

	const handleReportUser = useCallback(() => {
		// check for email in /talent-about response
		if (loginType === 'talent' && !myData?.email) {
			navigation.navigate('EmailInput', { userId: id, type: EnumReportType.User });
		} else navigation.navigate('ReasonInput', { userId: id, type: EnumReportType.User });
	}, [reporterId, userType, id]);

	const handleBlockUser = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Block,
				data: {
					blocked_type: type,
					blocked_id: id,
				},
			},
		});
	}, [type, id]);

	const handleShare = useCallback(async () => {
		const isProducer = type === 'Producer';
		const name = `${isProducer ? formatName(talentData?.name) : formatName((talentData?.first_name || '') + ' ' + (talentData?.last_name || ''))}`;
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.PROFILE_SELF_SHARE];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			try {
				const platformType = Platform.OS;
				await Share.share({
					message: `Watch ${name}'s latest showreel, only on Talent Grid\n\nhttps://ttgd.in/${isProducer ? 'p' : 't'}/${id}`,
					title: `${type} Profile of ${name}`,
				});
			} catch (error: any) {
				if (Platform.OS === 'android') {
					ToastAndroid.show('Failed to share. Please try again.', ToastAndroid.SHORT);
				} else {
					Alert.alert(
						'Error',
						error?.message || 'Failed to share. Please try again.', // Use error.message if available
						[{ text: 'OK' }],
					);
				}
			}
		}
	}, [type, id, talentData?.name, talentData?.first_name, talentData?.last_name]);

	const handleOthersShare = useCallback(async () => {
		const isProducer = type === 'Producer';
		const name = `${isProducer ? formatName(talentData?.name) : formatName((talentData?.first_name || '') + ' ' + (talentData?.last_name || ''))}`;
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.PROFILE_OTHER_SHARE];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			try {
				const platformType = Platform.OS;
				await Share.share({
					message : `Watch ${name}'s latest showreel, only on Talent Grid\n\nhttps://ttgd.in/${isProducer ? 'p' : 't'}/${id}`,
					title: `${type} Profile of ${name}`,
				});
			} catch (error: any) {
				if (Platform.OS === 'android') {
					ToastAndroid.show('Failed to share. Please try again.', ToastAndroid.SHORT);
				} else {
					Alert.alert(
						'Error',
						error?.message || 'Failed to share. Please try again.', // Use error.message if available
						[{ text: 'OK' }],
					);
				}
			}
		}
	}, [type, id, talentData?.name, talentData?.first_name, talentData?.last_name]);

	function navigateToConversation() {
		navigation.navigate('Conversation', {
			receiver_id: id,
			receiver_type: 'User',
			name: talentData?.first_name + ' ' + talentData?.last_name,
			picture: createAbsoluteImageUri(talentData?.profile_picture_url),
		});
	}

	return (
		<View style={styles.container}>
			{profession === 'manager' ? (
				<View style={styles.settingsContainer}>
					<Pressable onPress={() => navigation.navigate('ManagerSettings')}>
						<Settings color="white" size="24" />
					</Pressable>
				</View>
			) : profession === 'managerTalent' ? (
				<View style={styles.settingsContainer}>
					<Pressable onPress={() => navigation.navigate('ManagerTalentSettings')}>
						<Settings color="white" size="24" />
					</Pressable>
				</View>
			) : id !== userId && id !== producerId ? (
				<View style={styles.menuContainer}>
					{type === 'User' && loginType === 'producer' && (
						<Pressable onPress={() => navigation.navigate('OtherTalentCalendarView', { talent_id: id, name: talentData?.first_name })}>
							<Calendar color="transparent" strokeColor="white" strokeWidth={3} size="22" />
						</Pressable>
					)}
					<Menu>
						<MenuTrigger>
							<MenuIcon size="24" strokeColor="white" strokeWidth={3} />
						</MenuTrigger>
						<MenuOptions
							customStyles={{
								optionsContainer: {
									backgroundColor: '#1C1A1F',
								},
							}}>
							{/*<MenuOption onSelect={() => navigation.navigate('ProjectCalendarView')} style={styles.smPadding}>
								<Calendar color="transparent" strokeColor="white" strokeWidth={3} size="20" />
								<Text size="primarySm" color="regular">
									{type === 'Producer' ? "Producer's" : "Talent's"} calendar
								</Text>
							</MenuOption>*/}
							{type === 'User' && loginType === 'producer' && permissions?.includes('Project::Edit') && (
								<MenuOption onSelect={handleAddToProject} style={styles.smPadding}>
									<Add size="20" />
									<Text size="bodyMid" color="regular">
										Add to Project
									</Text>
								</MenuOption>
							)}
							{type === 'User' && loginType === 'producer' && permissions?.includes('Messages::View') && (
								<MenuOption onSelect={navigateToConversation} style={styles.smPadding}>
									<Mail size="20" />
									<Text size="bodyMid" color="regular">
										Message
									</Text>
								</MenuOption>
							)}
							<MenuOption onSelect={handleOthersShare} style={styles.smPadding}>
								<ShareIcon size="20" />
								<Text size="bodyMid" color="regular">
									Share Profile
								</Text>
							</MenuOption>
							{type === 'User' && (
								<MenuOption onSelect={handleReportUser} style={styles.smPadding}>
									<Report size="20" />
									<Text size="bodyMid" color="regular">
										Share Feedback
									</Text>
								</MenuOption>
							)}
							<MenuOption onSelect={handleBlockUser} style={styles.smPadding}>
								<Block size="20" color={theme.colors.destructive} />
								<Text size="bodyMid" color="error">
									Block {type === 'User' ? 'User' : 'Producer'}
								</Text>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			) : (
				<View style={styles.settingsContainer}>
					<Pressable onPress={() => navigation.navigate('Settings')}>
						<Settings color="white" size="24" />
					</Pressable>
					<Pressable onPress={handleShare}>
						<ShareIcon color="white" size="22" />
					</Pressable>
				</View>
			)}
		</View>
	);
});

export default ProfileHeader;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		flex: 1,
	},
	settingsContainer: { gap: theme.gap.xs, flexDirection: 'row', alignItems: 'center', paddingRight: theme.padding.xs },
	menuContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
	menuOptions: { backgroundColor: theme.colors.backgroundLightBlack },
	smPadding: { paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xxs, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs },
}));
