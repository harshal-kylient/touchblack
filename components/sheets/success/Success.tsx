import { Dimensions, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

import { Success as SuccessIcon } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

interface IProps {
	header: string;
	text?: string;
	icon?: JSX.Element;
	onPress?: () => void;
	onPressText?: string;
}

const width = Dimensions.get('window').width;

export default function Success({ header, icon, text, onPress, onPressText }: IProps) {
	const { styles, theme } = useStyles(stylesheet);

	async function handlePress() {
		if (typeof onPress === 'function') {
			await onPress();
		}
		SheetManager.hide('Drawer', {
			payload: {
				sheet: SheetType.Success,
			},
		});
	}

	const Icon = icon ? icon : SuccessIcon;

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<Icon color={theme.colors.success} size={`${width / 4}`} />
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
				<Button onPress={handlePress}>{onPressText || 'Continue'}</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: { justifyContent: 'center', alignItems: 'center' },
	iconContainer: {
		width: width / 3,
		height: width / 3,
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
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		alignSelf: 'stretch',
		padding: theme.padding.base,
	},
}));
