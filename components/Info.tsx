import CONSTANTS from '@constants/constants';
import { Success } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';
import { ReactElement } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
	header: string;
	text?: string;
	icon?: ReactElement;
	onSuccess: () => void;
	onDismiss?: () => void;
	successText?: string;
	dismissText?: string;
}

export default function Info({ icon, header, text, dismissText, onDismiss, successText, onSuccess }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const Icon = icon ? icon : Success;

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Icon color={theme.colors.success} size={`${CONSTANTS.screenWidth / 4}`} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					{header}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{text}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				{dismissText && onDismiss ? (
					<Button style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} type="secondary" textColor="regular" onPress={onDismiss}>
						{dismissText || 'Cancel'}
					</Button>
				) : null}
				<Button style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} onPress={onSuccess}>
					{successText || 'Continue'}
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: { justifyContent: 'center', alignItems: 'center' },
	iconContainer: {
		width: CONSTANTS.screenWidth / 3,
		height: CONSTANTS.screenWidth / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.lg,
		gap: theme.gap.sm,
		alignSelf: 'stretch',
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
	},
	buttonContainer: {
		minWidth: '100%',
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		alignSelf: 'stretch',
		padding: theme.padding.base,
	},
}));
