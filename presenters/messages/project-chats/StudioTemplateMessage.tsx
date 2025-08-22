import { useCallback, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Text } from '@touchblack/ui';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import { formatDates } from '@utils/formatDates';
import IMessageItem from '@models/entities/IMessageItem';
import { SheetType } from 'sheets';
import { useQueryClient } from '@tanstack/react-query';
import useGetProducerDetails from '@network/useGetProducerDetails';
import { useNavigation } from '@react-navigation/native';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import moment from 'moment';
import { useStudioConversationContext } from './useStudioConversationContext';
import useGetStudioFloorPricing from '@network/useGetStudioFloorPricing';

interface TemplateMessageProps {
	item: IMessageItem;
	status: EnumStudioStatus;
	project_id: UniqueId;
	party1_id: UniqueId;
	party2_id: UniqueId;
	conversation_id: UniqueId;
}

function to2Digit(num: string | number) {
	return String(num).padStart(2, '0');
}

export default function StudioTemplateMessage({ item: message, party1_id, party2_id, status, conversation_id }: TemplateMessageProps) {
	const { theme } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const item = message?.content;
	const producerId = party2_id;
	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const { setSetupDays, setShootDays, setTotalDays, setDismantleDays } = useStudioConversationContext();

	// replace this with backend data
	useEffect(() => {
		setSetupDays(item?.setup_days);
		setShootDays(item?.shoot_days);
		setDismantleDays(item?.dismantle_days);
		setTotalDays(item?.total_days);
	}, []);

	const { data: producerData, isLoading: producerDataLoading, error: producerError } = useGetProducerDetails(producerId);

	const { data: studioFloorPricing, isLoading: studioFloorPricingLoading, error: pricingError } = useGetStudioFloorPricing(party1_id);

	const studio_amount = studioFloorPricing?.find(it => it.id === item?.shoot_type_mapping_id);

	const handleOptOut = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioOptOut,
				data: {
					conversation_id: conversation_id,
					booking_id: item?.sf_booking_id,
					onSuccess: async () => {
						await queryClient.invalidateQueries('useGetStudioCalendarList');
						await queryClient.invalidateQueries('useGetStudioFloorBookings');
					},
				},
			},
		});
	}, [conversation_id, item?.sf_booking_id]);

	const handleInterested = useCallback(() => {
		navigation.navigate('StudioNegotiation', {
			booking_id: item?.sf_booking_id,
			days: item?.dates?.length,
			hours: item?.start_time === '00:00' && item?.end_time === '23:59' ? 12 : +moment(item?.end_time, 'HH:mm').format('HH') - +moment(item?.start_time, 'HH:mm').format('HH'),
			conversation_id,
			studio_floor_id: party1_id,
			video_type_mapping_id: item?.shoot_type_mapping_id,
			project_name: capitalized(item?.project_name),
			film_type: item?.film_type,
			setup_days: item?.setup_days,
			shoot_days: item?.shoot_days,
			dismantle_days: item?.dismantle_days,
			onSuccess: async () => {
				await queryClient.invalidateQueries('useGetStudioCalendarList');
				await queryClient.invalidateQueries('useGetStudioFloorBookings');
			},
		});
	}, [conversation_id, item, party1_id, navigation, queryClient]);

	const interestedDisabled = item?.regular_booking_allowed === false ? true : (loginType === 'studio' && !permissions?.includes('Messages::Edit')) || status === EnumStudioStatus['Not available'] || status === EnumStudioStatus.Cancelled || status !== EnumStudioStatus.Enquiry;

	const notAvailableDisabled = item?.regular_booking_allowed === false ? true : (loginType === 'studio' && !permissions?.includes('Messages::Edit')) || status === EnumStudioStatus['Not available'] || status === EnumStudioStatus.Cancelled;

	return (
		<>
			<View style={{ padding: theme.padding.base, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text size="primarySm" color={'regular'}>
					{item?.message || 'No message content'}
				</Text>
			</View>
			<View style={{ padding: theme.padding.base, gap: theme.gap.xl }}>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Producer
					</Text>
					{producerDataLoading ? (
						<ActivityIndicator size="small" color={theme.colors.primary} />
					) : producerError ? (
						<Text size="primarySm" color="error">
							Failed to load producer
						</Text>
					) : (
						<Text size="primarySm" color="regular">
							{capitalized(producerData?.data?.owner_name || 'Unknown')}
						</Text>
					)}
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Project Name
					</Text>
					<Text size="primarySm" color="regular">
						{item?.project_name || 'Not specified'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Film Type
					</Text>
					<Text size="primarySm" color="regular">
						{item?.film_type || 'Not specified'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Amount/shift
					</Text>
					{studioFloorPricingLoading ? (
						<ActivityIndicator size="small" color={theme.colors.primary} />
					) : pricingError ? (
						<Text size="primarySm" color="error">
							Failed to load pricing
						</Text>
					) : (
						<Text size="primarySm" color="regular">
							{studio_amount ? `₹ ${studio_amount.total_price_per_shift}` : 'Price not available'}
						</Text>
					)}
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Total number of Days
					</Text>
					<Text size="primarySm" color="regular">
						{item?.total_days !== undefined ? to2Digit(item.total_days) : '00'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Setup Days
					</Text>
					<Text size="primarySm" color="regular">
						{item?.setup_days !== undefined ? to2Digit(item.setup_days) : '00'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Shoot Days
					</Text>
					<Text size="primarySm" color="regular">
						{item?.shoot_days !== undefined ? to2Digit(item.shoot_days) : '00'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Dismantle Days
					</Text>
					<Text size="primarySm" color="regular">
						{item?.dismantle_days !== undefined ? to2Digit(item.dismantle_days) : '00'}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Dates
					</Text>
					<Text size="primarySm" color="regular">
						{item?.dates ? formatDates(item.dates) : 'No dates specified'}
					</Text>
				</View>
			</View>
			{loginType !== 'producer' && (
				<View style={{ flexDirection: 'row' }}>
					<Button
						isDisabled={notAvailableDisabled}
						onPress={handleOptOut}
						type="secondary"
						textColor="regular"
						style={{
							flex: 1,
							opacity: notAvailableDisabled ? 0.6 : 1,
							borderRightWidth: theme.borderWidth.slim,
							borderTopWidth: theme.borderWidth.slim,
							borderColor: theme.colors.borderGray,
						}}>
						Not Available
					</Button>
					<Button
						isDisabled={interestedDisabled}
						onPress={handleInterested}
						type="primary"
						style={{
							flex: 1,
							opacity: interestedDisabled ? 0.6 : 1,
							borderRightWidth: theme.borderWidth.slim,
							borderTopWidth: theme.borderWidth.slim,
							borderColor: theme.colors.borderGray,
						}}>
						Interested
					</Button>
				</View>
			)}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	messagesList: {
		paddingHorizontal: theme.padding.base,
	},
	messageContainer: (isMe: boolean) => ({
		alignSelf: isMe ? 'flex-end' : 'flex-start',
		backgroundColor: isMe ? '#50483B' : theme.colors.backgroundLightBlack,
		marginVertical: theme.margins.xs,
		maxWidth: '80%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	messageText: {
		// color: theme.colors.typography,
	},
	timestamp: {
		color: theme.colors.muted,
		fontSize: 10,
		alignSelf: 'flex-start',
		marginTop: 4,
	},
	inputContainer: {
		paddingVertical: 6,
		paddingLeft: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		marginBottom: theme.margins.base,
	},
	input: (height: number) => ({
		height,
		color: theme.colors.typography,
		flex: 1,
	}),
}));
