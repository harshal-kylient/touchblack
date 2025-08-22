import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Delete } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { useState } from 'react';

export default function DeleteNotification() {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	async function onSubmit() {
		const response = await server.post(CONSTANTS.endpoints.all_notifications());
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Deleted',
						text: 'The notification is successfully deleted.',
					},
				},
			});
		} else {
			setServerError(response.data?.message);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.iconContainer}>
					<View style={styles.icon}>
						<Delete color={theme.colors.success} size={`${CONSTANTS.screenWidth / 4}`} />
					</View>
				</View>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					Delete Notification!
				</Text>
				<Text size="bodyBig" color="muted" style={[styles.regularFontFamily, { paddingHorizontal: theme.margins.xs }]}>
					Are you sure you want to delete this notification? This action cannot be undone.
				</Text>
			</View>
			<Text color="error" size="primaryMid" style={styles.errorText(serverError)}>
				{serverError}
			</Text>
			<View style={styles.buttonContainer}>
				<Button
					textColor="regular"
					type="secondary"
					style={styles.buttonCancel}
					onPress={() =>
						SheetManager.hide('Drawer', {
							payload: { sheet: SheetType.DeleteNotification },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={onSubmit}>
					Confirm
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		gap: theme.gap.base,
		marginBottom: theme.margins.base,
	},
	iconContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	errorText: (serverError: any) => ({
		width: '100%',
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	icon: {
		width: CONSTANTS.screenWidth / 3,
		height: CONSTANTS.screenWidth / 3,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		marginHorizontal: theme.margins.xs,
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
