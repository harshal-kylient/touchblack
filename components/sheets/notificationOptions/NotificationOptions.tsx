import { Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { DoubleTick } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationOptions({ id }: { id: UniqueId }) {
	const queryClient = useQueryClient();
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	/*const handleDeletePress = () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.DeleteNotification,
				data: { id }
			},
		});
	};*/

	async function handleMarkRead() {
		const response = await server.post(CONSTANTS.endpoints.mark_notification_read, { notification_id: id });
		if (!response.data?.success) {
			setServerError(response.data?.message);
		} else {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: { header: 'Notification marked as read', text: 'Notification is successfully marked as read', onPress: () => queryClient.invalidateQueries('useGetAllNotifications') },
				},
			});
		}
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleMarkRead} style={styles.optionContainer}>
					<DoubleTick size="24" />
					<Text size="button" color="muted">
						Mark as read
					</Text>
				</TouchableOpacity>
				{/*<TouchableOpacity onPress={handleDeletePress} style={styles.optionContainer}>
					<Delete size="24" />
					<Text size="button" color="muted">
						Delete Notification
					</Text>
				</TouchableOpacity>*/}
			</View>
			{serverError ? (
				<Pressable onPress={() => setServerError('')} style={{ borderBottomWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, paddingVertical: theme.padding.xs, borderColor: theme.colors.destructive }}>
					<Text size="bodyMid" textAlign="center" color="error">
						{serverError}
					</Text>
				</Pressable>
			) : null}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		padding: theme.padding.base,
		gap: theme.gap.xs,
	},
	optionContainer: { flexDirection: 'row', gap: theme.gap.xs, alignItems: 'center' },
}));
