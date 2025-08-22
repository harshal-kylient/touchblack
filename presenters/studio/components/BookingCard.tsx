import { useCallback, useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Close, LongArrowRight, Person, Receipt } from '@touchblack/icons';
import { Slideable, Text } from '@touchblack/ui';
import { SheetType } from 'sheets';
import { useNavigation } from '@react-navigation/native';
import { useStudioContext } from '../StudioContext';
import { useAuth } from '@presenters/auth/AuthContext';

export type BookingData = {
	producer_name: string;
	project_name: string;
	start_time: string;
	end_time: string;
	total_days: number;
	imageUrl?: string;
	status: 'enquiry' | 'tentative' | 'confirmed';
	id: string;
	conversation_id: string;
	producer_id: string;
	project_id: string;
};

type BookingCardProps = {
	booking: BookingData;
};

function BookingCard({ booking }: BookingCardProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { studioFloor } = useStudioContext();
	const { permissions } = useAuth();
	const navigation = useNavigation();
	const disabled = !permissions?.includes('Messages::View');

	const bookingTypeInfo = {
		enquiry: {
			header: 'Cancel Enquiry',
			text: `Are you sure you want to cancel ${booking.producer_name} Enquiry?`,
		},
		tentative: {
			header: 'Cancel Tentative Booking',
			text: `Are you sure you want to cancel ${booking.producer_name} Tentative Booking?`,
		},
		confirmed: {
			header: 'Cancel Confirmed project!',
			text: `Are you sure you want to cancel ${booking.producer_name} Confirmed project? The refund of advance amount will be initiated.`,
		},
	};

	const { header, text } = bookingTypeInfo[booking.status];

	const handleBookingPress = useCallback(
		(booking: BookingData) => {
			navigation.navigate('StudioConversation', {
				id: booking?.conversation_id,
				project_name: booking.project_name,
				party1Id: studioFloor?.id,
				party2Id: booking?.producer_id,
				project_id: booking.project_id,
				name: booking.project_name,
				receiver_id: booking.producer_id,
			});
		},
		[navigation, studioFloor, booking],
	);

	const handleCancelBooking = () => {
		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.CancelStudioBooking, data: { booking_id: booking.id, header, text } },
		});
	};

	const DeleteButton = useMemo(
		() => (
			<View style={styles.buttonElement}>
				<Close size="24" strokeColor={theme.colors.black} color={theme.colors.black} />
				<Text size="cardSubHeading" color="black">
					Cancel
				</Text>
			</View>
		),
		[theme, styles],
	);

	function formatDays(days: number): string {
		return days < 10 ? `0${days}` : `${days}`;
	}

	return (
		<Slideable onButtonPress={handleCancelBooking} buttonElement={DeleteButton}>
			<Pressable onPress={() => handleBookingPress(booking)} disabled={disabled} style={styles.container}>
				<View style={styles.contentContainer}>
					{booking.imageUrl ? (
						<Image source={{ uri: booking.imageUrl }} style={styles.image} />
					) : (
						<View style={[styles.image, { alignItems: 'center', justifyContent: 'center' }]}>
							<Person size="64" color={theme.colors.typographyLight} />
						</View>
					)}
					<View style={styles.detailsContainer}>
						<View style={styles.row}>
							<View style={styles.titleContainer}>
								<Text size="bodyBig" color="regular" weight="bold" style={styles.titleText}>
									{booking.project_name}
								</Text>
								<Text size="bodySm" color="regular" style={styles.subtitleText}>
									{booking.producer_name}
								</Text>
							</View>
							<View style={styles.button(disabled)}>
								<LongArrowRight size="24" color="black" />
							</View>
						</View>
						<View style={styles.row}>
							<View style={styles.infoContainer}>
								<Text size="bodySm" color="muted" style={styles.infoLabel}>
									Total days
								</Text>
								<Text size="bodyMid" color="regular" weight="bold" style={styles.infoValue}>
									{booking.total_days ? formatDays(booking.total_days) : '-'}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</Pressable>
		</Slideable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	contentContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		marginHorizontal: theme.margins.base,
		flexDirection: 'row',
	},
	image: {
		width: 128,
		height: 128,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	detailsContainer: {
		flex: 1,
	},
	button: (disabled: boolean = false) => ({
		backgroundColor: disabled ? theme.colors.muted : theme.colors.primary,
		padding: theme.padding.base,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	}),
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xs,
		flex: 1,
	},
	titleContainer: {
		gap: theme.gap.xxxs,
	},
	titleText: {
		lineHeight: 22,
		opacity: 0.8,
	},
	subtitleText: {
		lineHeight: 14,
	},
	infoContainer: {
		gap: theme.gap.xxxs,
	},
	infoLabel: {
		lineHeight: 14,
	},
	infoValue: {
		lineHeight: 16,
	},
	buttonElement: {
		backgroundColor: theme.colors.destructive,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		paddingHorizontal: theme.padding.base,
	},
}));

export default BookingCard;
