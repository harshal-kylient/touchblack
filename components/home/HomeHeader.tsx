import { Image, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Bookmark, Notification } from '@touchblack/icons';
import profileFallback from '@assets/images/profileFallback.png';

import { useAuth } from '@presenters/auth/AuthContext';
import useGetAllNotifications from '@network/useGetAllNotifications';
import INotificationItem from '@models/entities/INotificationItem';
import useGetTalentDetails from '@network/useGetTalentDetails';
import useGetProducerDetails from '@network/useGetProducerDetails';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

export const HomeHeader = () => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<NativeStackNavigationProp<any>>();
	const { loginType, userId, producerId } = useAuth();
	const { data: talentData } = useGetTalentDetails(userId!);
	const { data: producerData } = useGetProducerDetails(producerId!);

	const talentProfilePicture = talentData?.data?.profile_picture_url;
	const producerProfilePicture = producerData?.data?.profile_pic_url;

	const profilePic = loginType === 'talent' ? talentProfilePicture : loginType === 'producer' ? producerProfilePicture : null;
	const { data: response } = useGetAllNotifications();
	const notifications: INotificationItem[] = response?.pages?.flatMap(page => page?.data) || [];
	const hasUnreadNotifications = notifications.some(it => !it.clicked_at);

	const handleProfileRedirection = () => {
		loginType === 'talent' ? navigation.navigate('TalentProfile', { id: userId }) : navigation.navigate('ProducerProfile', { id: producerId });
	};

	const handleNotificationRedirection = () => {
		navigation.navigate('Notifications');
	};

	const renderProfileImage = () => {
		const source = profilePic ? { uri: createAbsoluteImageUri(profilePic) } : profileFallback;
		return <Image source={source} style={styles.image} />;
	};

	const handleBlackbookRedirection = () => {
		navigation.navigate('Blackbook');
	};

	return (
		<View style={styles.headerRightContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundLightBlack} />
			{loginType === 'talent' && (
				<TouchableOpacity onPress={handleBlackbookRedirection} style={styles.buttonContainer}>
					<Bookmark color="none" size="21" strokeWidth="3" strokeColor="white" />
				</TouchableOpacity>
			)}
			<TouchableOpacity onPress={handleNotificationRedirection} style={styles.buttonContainer}>
				<Notification color="none" size="24" strokeWidth="3" strokeColor="white" />
				{hasUnreadNotifications ? <View style={{ backgroundColor: theme.colors.primary, width: 9, height: 9, borderRadius: 9, overflow: 'hidden', position: 'absolute', top: 12, right: 16 }} /> : null}
			</TouchableOpacity>
			{loginType === 'producer' && (
				<TouchableOpacity style={styles.buttonContainer} onPress={handleProfileRedirection}>
					{renderProfileImage()}
				</TouchableOpacity>
			)}
		</View>
	);
};

export default HomeHeader;

const stylesheet = createStyleSheet(theme => ({
	headerRightContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderColor: theme.colors.borderGray,
		borderRightWidth: 0,
		borderTopWidth: 0,
		borderWidth: theme.borderWidth.slim,
	},
	buttonContainer: {
		borderRightColor: theme.colors.borderGray,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderTopWidth: 0,
		marginVertical: 0.1,
	},
	secondButtonContainer: {
		backgroundColor: theme.colors.black,
		borderTopWidth: 0,
	},
	image: { width: 48, height: 48 },
}));
