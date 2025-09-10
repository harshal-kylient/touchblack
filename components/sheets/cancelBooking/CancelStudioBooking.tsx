import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Close } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import CONSTANTS from '@constants/constants';
import { usePatchStudioFloorBookingStatus } from '@network/usePatchStudioFloorBookingStatus';

export default function CancelStudioBooking({ booking_id, header, text }: { booking_id: string; header: string; text: string }) {
	const { styles, theme } = useStyles(stylesheet);
	const patchStudioFloorBookingStatus = usePatchStudioFloorBookingStatus();

	async function onSubmit() {
		try {
			await patchStudioFloorBookingStatus.mutateAsync({
				studio_floor_booking_id: booking_id,
				status: 'cancelled',
			});
			SheetManager.hide('Drawer');
			// mutate studio floor bookings
		} catch (error) {}
	}

	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.iconContainer}>
					<View style={styles.icon}>
						<View style={{ borderRadius: 100, backgroundColor: theme.colors.destructive }}>
							<Close color={theme.colors.black} size={`${CONSTANTS.screenWidth / 6}`} />
						</View>
					</View>
				</View>
				<Text size="primaryMid" color="regular" style={styles.regularFontFamily}>
					{header}
				</Text>
				<Text size="bodyBig" color="muted" style={[styles.regularFontFamily, { paddingHorizontal: theme.margins.xs }]}>
					{text}
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button textColor="regular" type="secondary" style={styles.buttonCancel} onPress={() => SheetManager.hide('Drawer')}>
					No
				</Button>
				<Button style={styles.buttonSubmit} onPress={onSubmit}>
					Yes
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
