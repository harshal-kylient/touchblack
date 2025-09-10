import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import INotificationItem from '@models/entities/INotificationItem';
import { getRelativeTime } from '@utils/getRelativeTime';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';

import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import { TalentManagerStorage } from '@utils/storage';

function NotificationItem({ item }: { item: INotificationItem }) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const isRead = Boolean(item?.clicked_at);
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { subscriptionData } = useSubscription();
	function transferToScreen(link: string) {
		const videoRegex = /^talent-grid:\/\/video\/([a-zA-Z0-9_-]+)$/;
		const projectRegex = /^talent-grid:\/\/project\/([a-zA-Z0-9_-]+)$/;
		const projectDetailsStudioRegex = /^talent-grid:\/\/project-details\/([a-zA-Z0-9_-]+)\/studio$/;
		const projectDetailsRegex = /^talent-grid:\/\/project-details\/([a-zA-Z0-9_-]+)$/;
		const talentRegex = /^talent-grid:\/\/talent\/([a-zA-Z0-9_-]+)$/;
		const producerRegex = /^talent-grid:\/\/producer\/([a-zA-Z0-9_-]+)$/;
		const subscriptionsRegex = /^talent-grid:\/\/subscription-details$/;
		const studioConversationRegex = /^talent-grid:\/\/studio-chat\/([^\/]+)\/([^\/]+)$/;
		const studioDetailsRegex = /^talent-grid:\/\/studio-details\/([^\/]+)$/;
		const sutdioDetailsTeamRegex = /^talent-grid:\/\/studio-details\/([^\/]+)\/teams$/;
		const projectConversationRegex = /^talent-grid:\/\/project-chat\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$/;
		const otherConversationRegex = /^talent-grid:\/\/chat\/([^\/]+)\/([^\/]+)$/;
		const studioBookingsRegex = /^talent-grid:\/\/studio-projects$/;
		const projectCompletedRegex = /^talent-grid:\/\/project-completed\/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?$/;

		let match;

		if ((match = videoRegex.exec(link))) {
			// VideoPlayer.tsx
			const videoId = match[1];

			navigation.navigate('VideoPlayer', { id: videoId });
		} else if ((match = projectRegex.exec(link))) {
			// ProjectDetails.tsx
			const projectId = match[1];

			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			navigation.navigate('ProjectDetails', { project_id: projectId });
		} else if ((match = projectDetailsRegex.exec(link))) {
			// ProjectDetails.tsx
			const projectId = match[1];

			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			navigation.navigate('ProjectDetails', { project_id: projectId });
		} else if ((match = projectDetailsStudioRegex.exec(link))) {
			// ProjectDetails.tsx
			const project_id = match[1];

			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			navigation.navigate('ProjectDetails', {
				project_id,
				// TODO: replace this with Enum of ProjectDetails tab
				tab: 2,
			});
		} else if ((match = talentRegex.exec(link))) {
			// TalentProfile.tsx
			const talentId = match[1];

			navigation.navigate('TalentProfile', { id: talentId });
		} else if ((match = producerRegex.exec(link))) {
			// ProducerProfile.tsx
			const producerId = match[1];

			navigation.navigate('ProducerProfile', { id: producerId });
		} else if ((match = projectCompletedRegex.exec(link))) {
			// RaiseClaim.tsx
			const conversation_id = match[1];
			const project_id = match[2];
			const talent_id = match[3];
			if (talent_id) {
				TalentManagerStorage.set('requiredTalentId', talent_id);
			}
			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			navigation.navigate('RaiseClaim', { conversation_id, project_id, type: 'talentNotification' });
		} else if ((match = studioConversationRegex.exec(link))) {
			// StudioConversation.tsx
			const conversation_id = match[1];
			const project_id = match[2];

			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			else if (loginType === 'studio' && !permissions?.includes('Messages::View')) return;
			navigation.navigate('StudioConversation', {
				project_id,
				id: conversation_id,
			});
		} else if ((match = studioDetailsRegex.exec(link))) {
			// StudioProfile.tsx
			const studio_id = match[1];

			navigation.navigate('StudioProfile', { id: studio_id, tab: 1 });
		} else if ((match = sutdioDetailsTeamRegex.exec(link))) {
			// StudioProfile.tsx
			const studio_id = match[1];

			navigation.navigate('StudioProfile', { id: studio_id, tab: 1 });
		} else if ((match = projectConversationRegex.exec(link))) {
			const conversation_id = match[1];
			const project_id = match[2];
			const talent_id = match[3];
			if (talent_id) {
				TalentManagerStorage.set('requiredTalentId', talent_id);
			}
			if (loginType === 'producer' && !permissions?.includes('Project::View')) return;
			navigation.navigate('ProjectConversation', {
				id: conversation_id,
				project_id,
			});
		} else if ((match = otherConversationRegex.exec(link))) {
			// Not Added yet
			return;
		} else if ((match = studioBookingsRegex.exec(link))) {
			// StudioBookings.tsx
			navigation.navigate('StudioBookings');
		} else if ((match = subscriptionsRegex.exec(link))) {
			navigation.navigate('Subscriptions');
		}
	}

	async function markAsRead() {
		return await server.post(CONSTANTS.endpoints.mark_notification_read, { notification_id: item.id });
	}
	const handleNotificationPopUp = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.NOTIFICATIONS];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			onPress();
		}
	};
	async function onPress() {
		if (!item?.clicked_at) {
			await markAsRead();
			queryClient.invalidateQueries(['useGetAllNotifications']);
		}
		if (!item.deeplink) {
			return;
		}

		// Linking.openURL(item.deeplink);
		transferToScreen(item.deeplink);
	}

	return (
		<TouchableOpacity onPress={handleNotificationPopUp} style={styles.notificationItemContainer(isRead)}>
			<View style={styles.notificationItemContentContainer}>
				<View style={styles.contentHeader}>
					<View style={styles.heading}>
						<View style={styles.titleContainer}>
							{!isRead && <View style={styles.unreadIdentifier} />}
							<Text size="bodyBig" numberOfLines={1} color="regular">
								{item?.title}
							</Text>
						</View>
						<Text size="bodySm" style={styles.timeText} color="regular">
							{getRelativeTime(item?.created_at)}
						</Text>
					</View>
				</View>
				<View style={styles.contentBody}>
					<Text size="bodyMid" style={styles.bodyText} color="regular">
						{item?.body}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default NotificationItem;

const stylesheet = createStyleSheet(theme => ({
	notificationItemContainer: (isRead: boolean) => ({
		backgroundColor: isRead ? theme.colors.backgroundDarkBlack : theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	}),
	titleContainer: { flexDirection: 'row', gap: theme.gap.xs, maxWidth: '78%', minWidth: '78%', alignItems: 'center' },
	notificationItemContentContainer: {
		marginHorizontal: theme.margins.base,
		padding: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	contentHeader: {
		marginBottom: 4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	heading: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	unreadIdentifier: {
		width: 12,
		height: 12,
		borderRadius: 50,
		backgroundColor: theme.colors.success,
	},
	contentBody: {
		marginBottom: 8,
	},
	bodyText: {
		opacity: 0.8,
		maxWidth: '80%',
	},
	timeText: {
		opacity: 0.4,
	},
}));
