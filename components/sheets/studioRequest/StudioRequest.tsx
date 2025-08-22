import { Dimensions, Pressable, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { EyeMagnifyingGlass, Copy } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

interface IProps {
	header: string;
	text?: string;
	onPress?: () => void;
	onPressText?: string;
}

const width = Dimensions.get('window').width;

export default function StudioRequest({ header, text, onPress, onPressText }: IProps) {
	const { styles, theme } = useStyles(stylesheet);

	async function handlePress() {
		if (typeof onPress === 'function') {
			await onPress();
		}
		SheetManager.hide('Drawer');
	}

	const handleCopyEmail = () => {
		Clipboard.setString('Cs@talentgridnow.com');
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<EyeMagnifyingGlass strokeColor={theme.colors.success} size={`${width / 6}`} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					{header}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{text}
				</Text>
				<Pressable style={styles.emailContainer} onPress={handleCopyEmail}>
					<Text color="regular" size="bodyBig" style={styles.regularFontFamily}>
						Cs@talentgridnow.com
					</Text>
					<Copy strokeColor={theme.colors.primary} size={`24`} />
				</Pressable>
			</View>
			<View style={styles.buttonContainer}>
				<Button onPress={handlePress}>{onPressText || 'Back'}</Button>
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
	emailContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.gap.xxs,
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
