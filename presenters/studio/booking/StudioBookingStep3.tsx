import { SafeAreaView, ScrollView, View, Text as RNText, Pressable, Platform } from 'react-native';
import { Button, Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import StudioStepsIndicator from './StepsIndicator';
import { useStudioBookingContext } from './StudioContext';
import { LongArrowLeft, Minus } from '@touchblack/icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Success from './Success';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetProducerDetails from '@network/useGetProducerDetails';
import { formatDates } from '@utils/formatDates';
import StudioCardView from './StudioCardView';
import useGetProjectDetails from '@network/useGetProjectDetails';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

export default function StudioBookingStep3() {
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useStudioBookingContext();
	const { producerId } = useAuth();
	const { data } = useGetProducerDetails(producerId!);
	const producer_data = data?.data;
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = useState('');
	const [created, setCreated] = useState(false);

	const { data: project_details } = useGetProjectDetails(state.project_id?.id);

	async function handleSubmit() {
		const payload = state.studio_floor?.map(it => ({
			studio_floor_id: it?.id,
			producer_id: producerId,
			project_id: state.project_id?.id,
			dates: state.dates,
			start_time: state.full_day ? '00:00' : state.from_time,
			end_time: state.full_day ? '23:59' : state.to_time,
			total_days: state.dates.length,
			setup_days: Number(state.set_up),
			shoot_days: Number(state.shoot),
			dismantle_days: Number(state.dismantle),
		}));

		const response = await server.post(CONSTANTS.endpoints.book_studio_floor, { studio_floors_booking: payload });
		if (response.data?.success) {
			/* Itne paise me beta yahi milta hai */
			const res = await Promise.allSettled(state.studio_floor?.map(it => server.post(CONSTANTS.endpoints.create_conversation(producerId!, it?.id, producerId, state?.project_id?.id))));
			setCreated(true);
			return;
		} else setServerError(response.data?.message);
	}

	function handleSuccess() {
		queryClient.invalidateQueries(['useGetProjectStudiosList', state.project_id?.id]);
		queryClient.invalidateQueries(['useGetProducerCalendarList']);
		dispatch({ type: 'RESET' });
		setCreated(false);
		navigation.dispatch(StackActions.pop(3));
	}

	function handleEditDetails() {
		navigation.navigate('CreateProjectStep1');
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<Pressable style={styles.button} onPress={navigation.goBack}>
						<LongArrowLeft color={theme.colors.typography} size="24" />
					</Pressable>
					<RNText style={styles.heading}>Confirm Studios</RNText>
				</View>
			</View>
			<StudioStepsIndicator step={2} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ zIndex: 1 }}
				bounces={false}
				contentContainerStyle={{
					justifyContent: 'space-between',
					gap: theme.gap.xxl,
					paddingBottom: 84,
					backgroundColor: theme.colors.backgroundDarkBlack,
				}}>
				<View style={{ paddingTop: theme.padding.base, paddingHorizontal: theme.padding.base, gap: theme.gap.base }}>
					<Text color="regular" size="secondary">
						Project Details
					</Text>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Producer
						</Text>
						<Text color="regular" size="bodyBig">
							{producer_data?.owner_name}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Project Name
						</Text>
						<Text color="regular" size="bodyBig">
							{project_details?.project_name}
						</Text>
					</View>
					{project_details?.brand?.name ? (
						<View style={{ gap: theme.gap.xxxs }}>
							<Text color="muted" size="bodyMid">
								Brand Name
							</Text>
							<Text color="regular" size="bodyBig">
								{project_details?.brand?.name}
							</Text>
						</View>
					) : null}
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Film Type
						</Text>
						<Text color="regular" size="bodyBig">
							{project_details?.video_type?.name}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Total Number of Days
						</Text>
						<Text color="regular" size="bodyBig">
							{state.dates?.length}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Setup Days
						</Text>
						<Text color="regular" size="bodyBig">
							{state.set_up || 0}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Shoot Days
						</Text>
						<Text color="regular" size="bodyBig">
							{state.shoot || 0}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Dismantle Days
						</Text>
						<Text color="regular" size="bodyBig">
							{state.dismantle || 0}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Dates
						</Text>
						<Text color="regular" size="bodyBig">
							{formatDates(state.dates)}
						</Text>
					</View>
				</View>
				<View
					style={{
						borderTopWidth: theme.borderWidth.slim,
						borderColor: theme.colors.borderGray,
					}}>
					<View style={{ paddingHorizontal: theme.padding.base, borderBottomWidth: theme.borderWidth.bold, borderColor: theme.colors.muted }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.gap.xs, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.base, paddingHorizontal: theme.padding.base }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.xs }}>
								<Text color="regular" style={{ color: theme.colors.success }} size="primaryMid">
									{String(state?.studio_floor?.length).padStart(2, '0')}
								</Text>
								<Text color="regular" size="primaryMid">
									Studios
								</Text>
							</View>
							<Minus size="24" />
						</View>
					</View>
					{state.studio_floor.map(item => (
						<StudioCardView pressEnabled={false} key={item?.id} item={item} id={item?.id} />
					))}
				</View>
			</ScrollView>
			<View style={{ position: 'absolute', flexDirection: 'row', bottom: 0, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: 2 * theme.padding.base, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				{serverError ? (
					<Pressable onPress={() => setServerError('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.base, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Text color={'error'} textAlign="center" size="bodyBig">
							{serverError}
						</Text>
					</Pressable>
				) : null}
				<Button onPress={handleSubmit} style={{ flex: 1 }}>
					Send Enquiry
				</Button>
			</View>
			{created && <Success header={'Enquiry Sent'} text={'Your enquiry has reached the Studio owners. You will soon hear back from them!'} onDismiss={handleSuccess} onPress={handleSuccess} />}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textInput: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	accordion: {
		borderBottomWidth: 0,
		flex: 1,
	},
	container: {
		paddingHorizontal: theme.padding.base,
		...Platform.select({
			ios: {
				paddingBottom: theme.padding.sm,
			},
			android: {
				paddingVertical: theme.padding.sm,
			},
		}),
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	heading: {
		fontSize: theme.fontSize.primaryH2,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	buttonContainer: {
		zIndex: -9,
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		marginLeft: 0,
		backgroundColor: theme.colors.transparent,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 0,
		paddingRight: theme.padding.sm,
	},
}));
