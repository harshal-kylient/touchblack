import { Pressable, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Text } from '@touchblack/ui';
import { useState } from 'react';
import { Success as SuccessIcon } from '@touchblack/icons';
import CONSTANTS from '@constants/constants';

interface IProps {
	header: string;
	text?: string;
	onPress?: () => void;
	onDismiss?: () => void;
}

const width = CONSTANTS.screenWidth;

export default function Success({ header, text, onPress, onDismiss }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [message, setMessage] = useState('');

	async function handlePress() {
		if (typeof onPress === 'function') {
			await onPress();
		}
	}

	return (
		<Pressable onPress={onDismiss} style={{ flex: 1, zIndex: 999999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}>
			<View style={styles.container}>
				<View style={{ width: '100%', backgroundColor: theme.colors.black, justifyContent: 'center', alignItems: 'center', height: 12, position: 'absolute', top: -12, borderBottomWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<View
						style={{
							height: 2,
							width: 36,
							backgroundColor: theme.colors.typography,
						}}></View>
				</View>
				{/* Content Start */}
				<View style={styles.iconContainer}>
					<SuccessIcon color={theme.colors.success} size={`${width / 4}`} />
				</View>
				<View style={styles.contentContainer}>
					<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
						{header}
					</Text>
					<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
						{text}
					</Text>
				</View>
				{/* Content End */}
				{/* Buttons Start */}
				<View style={styles.buttonContainer}>
					{message ? (
						<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							<Text color={'error'} textAlign="center" size="bodyBig">
								{message}
							</Text>
						</Pressable>
					) : null}
					<Button onPress={handlePress}>Continue</Button>
				</View>
				{/* Buttons End */}
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		width: '100%',
		backgroundColor: theme.colors.backgroundDarkBlack,
		position: 'absolute',
		bottom: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.sm,
		padding: theme.padding.base,
		alignSelf: 'stretch',
	},
	calendarHeader: {
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		gap: theme.gap.xxs,
	},
	buttonContainer: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		alignSelf: 'stretch',
		padding: theme.padding.base,
	},
	buttonCancel: {
		flexGrow: 1,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	dayStyle: (isSelected: boolean) => ({
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: isSelected ? '#50483b' : 'transparent',
		width: UnistylesRuntime.screen.width / 7,
		height: UnistylesRuntime.screen.width / 7,
	}),
	textStyle: (state: string, isSelected: boolean, isToday: boolean) => ({
		color: state === 'disabled' ? theme.colors.muted : isSelected || isToday ? theme.colors.typography : theme.colors.muted,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
	iconContainer: {
		width: width / 3,
		height: width / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
	},
}));
