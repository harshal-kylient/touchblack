import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Delete } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';

export default function DeleteAccount() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { clearAuthStorage, deviceId } = useAuth();
	const [serverError, setServerError] = useState('');

	const handleLogout = async () => {
		try {
			const response = await server.post(CONSTANTS.endpoints.signout(deviceId!));
			if (response.data?.success) {
				clearAuthStorage();
				navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: 'Login' }],
					}),
				);
			}
		} catch (error) {}
	};

	async function onSubmit() {
		const response = await server.post(CONSTANTS.endpoints.delete_account);
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Deleted',
						text: 'Your account is successfully deleted.',
						onPress: handleLogout,
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
				<Text size="primaryMid" color="error" style={styles.regularFontFamily}>
					Delete Account
				</Text>
				<Text size="bodyBig" color="muted" style={[styles.regularFontFamily, { paddingHorizontal: theme.margins.xs }]}>
					This action is not reversible. Are you sure you want to delete your account on Talent Grid?
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
							payload: { sheet: SheetType.DeleteAccount },
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
		minWidth: '100%',
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
