import { Pressable, View, Modal as RNModal, ModalProps } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps extends ModalProps {
	onDismiss: () => void;
}

export default function Modal({ visible, onDismiss, ...props }: IProps) {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<RNModal visible={visible} transparent>
			<Pressable onPress={onDismiss} style={{ flex: 1, zIndex: 9999, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.9)' }}>
				<Pressable style={styles.container}>
					<View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: 10, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<View style={{ height: 2, width: 36, borderRadius: 8, backgroundColor: theme.colors.muted }}></View>
					</View>
					{props.children}
				</Pressable>
			</Pressable>
		</RNModal>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		position: 'absolute',
		bottom: 30,
		left: 0,
		right: 0,
		minWidth: '100%',
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
		flexDirection: 'row',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.muted,
		padding: theme.padding.lg,
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
}));
