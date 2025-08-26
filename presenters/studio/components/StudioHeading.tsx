import INotificationItem from '@models/entities/INotificationItem';
import useGetAllNotifications from '@network/useGetAllNotifications';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { useAuth } from '@presenters/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Notification } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function StudioHeading() {
	const { styles } = useStyles(stylesheet);
	const { data: response } = useGetAllNotifications();
	const { userId } = useAuth(); // studio is incorrectly created in the backend. Studio refers to the studio owner.
	const navigation = useNavigation();
	const notifications: INotificationItem[] = response?.pages?.flatMap(page => page?.data) || [];
	const hasUnreadNotifications = notifications.some(it => !it.clicked_at);
	const { data: studioOwnerDetails } = useGetTalentDetails(userId);

	const handleNotificationRedirection = () => {
		navigation.navigate('Notifications');
	};

	return (
		<View style={styles.header}>
			<Text size="bodyBig" style={styles.textStyles}>
				Hey, {studioOwnerDetails?.data?.first_name}!
			</Text>
			<Pressable onPress={handleNotificationRedirection} style={styles.notificationButton}>
				<Notification color="none" size="24" strokeWidth="3" strokeColor="white" />
				{hasUnreadNotifications ? <View style={styles.unreadNotification} /> : null}
			</Pressable>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	header: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	notificationButton: {
		borderRightColor: theme.colors.borderGray,
		width: 48,
		height: 48,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
	},
	unreadNotification: {
		backgroundColor: theme.colors.primary,
		width: 9,
		height: 9,
		borderRadius: 9,
		overflow: 'hidden',
		position: 'absolute',
		top: 12,
		right: 16,
	},
	textStyles: {
		fontFamily: 'Cabinet Grotesk',
		fontSize: 22,
		fontWeight: '500',
		color: '#FFFFFF',
	},
}));

export default StudioHeading;
