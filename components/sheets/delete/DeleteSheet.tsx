import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Delete } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import CONSTANTS from '@constants/constants';
import { useState } from 'react';

interface IProps {
	text: string;
	header: string;
	onDelete: () => void;
	onDismiss: () => void;
}

export default function DeleteSheet({ text, header, onDelete, onDismiss }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');

	async function onSubmit() {
		const res = await onDelete();
		if (!res?.data?.success) setServerError(res?.data?.message);
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
					{header}
				</Text>
				<Text size="bodyBig" color="muted" style={[styles.regularFontFamily, { paddingHorizontal: theme.margins.xs }]}>
					{text}
				</Text>
			</View>
			<Text color="error" size="primaryMid" style={styles.errorText(serverError)}>
				{serverError}
			</Text>
			<View style={styles.buttonContainer}>
				<Button textColor="regular" type="secondary" style={styles.buttonCancel} onPress={onDismiss}>
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
