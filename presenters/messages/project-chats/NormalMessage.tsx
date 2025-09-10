import IMessageItem from '@models/entities/IMessageItem';
import { Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import useSentByMe from './useSentByMe';

export default function NormalMessage({ item }: { item: IMessageItem }) {
	const { styles } = useStyles(stylesheet);
	const sentByMe = useSentByMe(item);

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primarySm" color="regular" style={styles.messageText(sentByMe)}>
					{item?.content}
				</Text>
			</View>
			<View style={styles.senderContainer}>
				<Text size="bodyMid" color="regular" style={styles.sender(sentByMe)}>
					{item?.sender_name}
				</Text>
			</View>
		</View>
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
	contentContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
	},
	senderContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
	},
	sender: (sentByMe: boolean) => ({
		textAlign: sentByMe ? 'right' : 'left',
		color: theme.colors.success,
		fontFamily: theme.fontFamily.cgBold,
		fontWeight: theme.fontWeight.bold,
	}),
	messageContainer: (isMe: boolean) => ({
		alignSelf: isMe ? 'flex-end' : 'flex-start',
		backgroundColor: isMe ? '#50483B' : theme.colors.backgroundLightBlack,
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
}));
