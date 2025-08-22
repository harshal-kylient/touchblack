import { Image, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import IMessage from '@models/entities/IMessage';
import { Person } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import { getRelativeTime } from '@utils/getRelativeTime';
import { useAuth } from '@presenters/auth/AuthContext';
import { useStudioContext } from '@presenters/studio/StudioContext';

interface IProps {
	item: IMessage;
	index: number;
	studioChat?: boolean;
}

export default function ConversationItem({ item, index, studioChat }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { userId, loginType, producerId } = useAuth();
	const { studioFloor } = useStudioContext();
	const myId = loginType === 'producer' ? producerId : loginType === 'studio' ? studioFloor?.id : userId;

	const isRead = item.is_last_message_read;
	const receiver_id = item.party1_id === myId ? item.party2_id : item.party1_id;

	const PersonIcon = () => <Person color={theme.colors.muted} />;
	const Icon = PersonIcon;

	const handleMessageItemPress = (item: IMessage) => {
		if (item?.conversation_type === 'producer_studio_floor') {
			navigation.navigate('StudioConversation', {
				id: item?.id,
				party1Id: item?.party1_id,
				party2Id: item?.party2_id,
				project_id: item?.project_id,
				receiver_id,
				name: item?.reciever_name,
				picture: item.reciever_profile_picture,
				owner_profile_picture: item.reciever_profile_picture,
				receiver_type: loginType === 'producer' ? 'User' : item.party2_type,
			});
			return;
		} else if (item?.conversation_type === 'project') {
			navigation.navigate('ProjectConversation', {
				id: item?.id,
				party1Id: item?.party1_id,
				party2Id: item?.party2_id,
				project_id: item?.project_id,
				receiver_id,
				name: item?.reciever_name,
				picture: item.reciever_profile_picture,
				owner_profile_picture: item.reciever_profile_picture,
				receiver_type: loginType === 'producer' ? 'User' : item.party2_type,
			});
			return;
		} else
			navigation.navigate('Conversation', {
				id: item.id,
				party1Id: item?.party1_id,
				party2Id: item?.party2_id,
				receiver_id,
				name: item.reciever_name,
				picture: item.reciever_profile_picture,
				receiver_type: loginType === 'producer' ? 'User' : item.party2_type,
			});
	};

	return (
		<Pressable
			onPress={() => {
				handleMessageItemPress(item);
			}}
			style={styles.container(!isRead, index)}>
			<View style={styles.profilePicContainer}>{item.reciever_profile_picture ? <Image source={{ uri: item.reciever_profile_picture }} style={styles.profilePic} /> : <Icon />}</View>
			<View style={styles.messageInfo}>
				<Text size="cardHeading" color="regular" weight="bold" style={styles.username}>
					{item.reciever_name}
				</Text>
				<Text size="bodySm" color={isRead ? 'muted' : 'regular'} style={styles.message} numberOfLines={1}>
					{item.last_message?.message ? item.last_message?.message : item.last_message?.content ? item.last_message?.content : item.last_message}
				</Text>
			</View>
			<View style={styles.messageMeta}>
				<View style={styles.unreadCount(!isRead)}></View>
				<Text size="bodySm" color="regular" style={styles.timeAgo}>
					{getRelativeTime(item.updated_at)}
				</Text>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: (unread: boolean, index: number) => ({
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: index === 0 ? theme.borderWidth.slim : 0,
		backgroundColor: unread ? theme.colors.backgroundLightBlack : theme.colors.black,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		height: 64,
	}),
	profilePicContainer: {
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 16,
	},
	profilePic: {
		width: 64,
		height: 64,
	},
	messageInfo: {
		flex: 1,
		gap: theme.gap.steps,
		marginLeft: theme.margins.base,
		paddingVertical: theme.padding.xs,
	},
	username: {
		opacity: 0.8,
	},
	message: {},
	messageMeta: {
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		gap: theme.gap.steps,
	},
	unreadCount: (unread: boolean) => ({
		backgroundColor: theme.colors.success,
		borderRadius: 50,
		width: 12,
		height: 12,
		justifyContent: 'center',
		opacity: unread ? 100 : 0,
		alignItems: 'center',
	}),
	unreadCountText: {
		fontWeight: 'bold',
	},
	timeAgo: {
		opacity: 0.4,
	},
}));
