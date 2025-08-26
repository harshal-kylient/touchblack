import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Text } from '@touchblack/ui';
import { SheetType } from 'sheets';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

export default function UnFollowUserSheet({ user_id, user_name, user_type }: { user_id: string; user_name: string; user_type: string }) {
	const { styles } = useStyles(stylesheet);
	const unfollowUserMutation = useMutation({
		mutationFn: (user_id: string) => server.delete(CONSTANTS.endpoints.unFollowUser(user_id)),
	});
	const queryClient = useQueryClient();

	function handleUnFollowUser() {
		unfollowUserMutation.mutate(user_id, {
			onSuccess:() => {
				queryClient.invalidateQueries(['useGetUserDetailsById', user_type, user_id]);
				queryClient.invalidateQueries(['useGetFollowingStatus', user_id]);
				SheetManager.hide('Drawer', {
					payload: { sheet: SheetType.UnFollowUserSheet },
				});
			},
		});
	}

	return (
		<View>
			<View style={styles.contentContainer}>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Unfollow {user_name}?
				</Text>
				<Text size="primarySm" color="regular" style={styles.description}>
					You’ll stop seeing content and receiving updates about this user.
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.UnFollowUserSheet },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={handleUnFollowUser}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	baseGap: {
		gap: theme.gap.xxs,
	},
	contentContainer: {
		margin: theme.margins.lg,
		gap: theme.gap.base,
	},
	formLabel: {
		fontSize: theme.fontSize.button,
	},
	textInput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		backgroundColor: theme.colors.backgroundDarkBlack,
		textAlignVertical: 'top',
		height: 80,
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		alignSelf: 'center',
	},
	description: {
		opacity: 0.5,
		alignSelf: 'center',
		width: '100%',
		textAlign: 'center',
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.muted,
		padding: theme.padding.lg,
	},
}));
