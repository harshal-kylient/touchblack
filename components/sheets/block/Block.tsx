import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Verified } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { useState } from 'react';

interface UserType {
	User: 'User';
	Producer: 'Producer';
}

type UniqueId = string;
interface IProps {
	blocked_type: UserType;
	blocked_id: UniqueId;
	onSuccess: () => void;
}

export default function Block(props: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	async function onSubmit() {
		const response = await server.post(CONSTANTS.endpoints.block, props);
		if (response.data?.success) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Blocked',
						text: `${props.blocked_type} is successfully blocked.`,
						onPress: () => SheetManager.hideAll(),
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
						<Verified color={theme.colors.success} size={`${CONSTANTS.screenWidth / 4}`} />
					</View>
				</View>
				<Text size="primaryMid" color="error" style={styles.regularFontFamily}>
					Block a user
				</Text>
				<Text size="bodyBig" color="muted" style={styles.regularFontFamily}>
					Are you sure you want to block this user? This action will prevent them from viewing your profile, sending you messages and interacting with your content.
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
							payload: { sheet: SheetType.Block },
						})
					}>
					Cancel
				</Button>
				<Button style={styles.buttonSubmit} onPress={onSubmit}>
					Block
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
