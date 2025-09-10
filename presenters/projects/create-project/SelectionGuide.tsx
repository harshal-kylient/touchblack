import { Pressable, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import CONSTANTS from '@constants/constants';
import { Close } from '@touchblack/icons';

const width = CONSTANTS.screenWidth;

export default function SelectionGuide({ onDismiss }: { onDismiss: () => void }) {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<Pressable onPress={onDismiss} style={{ flex: 1, zIndex: 9999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}>
			<View style={styles.container}>
				<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: 10, position: 'absolute', top: 0, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<View
						style={{
							height: 2,
							width: 36,
							backgroundColor: theme.colors.typography,
						}}></View>
				</View>
				<View
					style={{
						marginBottom: 6 * theme.margins.base,
						flex: 1,
						backgroundColor: 'rgba(0,0,0,0.8)',
						borderBottomWidth: theme.borderWidth.slim,
						borderColor: theme.colors.borderGray,
					}}>
					<View style={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: theme.colors.borderGray, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim }}>
						<View style={{ padding: theme.padding.base, borderColor: theme.colors.borderGray, borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, marginHorizontal: theme.margins.base, backgroundColor: theme.colors.backgroundDarkBlack }}>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic' }}>
								Note:
							</Text>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic' }}>
								Talent selection comprises of 3 levels.
							</Text>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic' }}>
								1. Choose Talent Type
							</Text>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic' }}>
								2. Set Dates for that talent type
							</Text>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic' }}>
								3. Adding talents into it
							</Text>
							<Text color="muted" size="bodyBig" style={{ fontStyle: 'italic', marginTop: theme.margins.base }}>
								The same process can be repeated for all other talent types.
							</Text>
						</View>
						<Pressable style={{ position: 'absolute', top: 8, right: theme.padding.base + 8 }} onPress={onDismiss}>
							<Close size="24" color={theme.colors.muted} />
						</Pressable>
					</View>
				</View>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		position: 'absolute',
		minWidth: '100%',
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.sm,
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
