import Header from '@components/Header';
import { Text } from '@touchblack/ui';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useState, useEffect } from 'react';
import { TimelineList, CalendarProvider, CalendarUtils, TimelineProps } from 'react-native-calendars';
import { groupBy } from 'lodash';
import moment from 'moment';
import { darkTheme } from '@touchblack/ui/theme';
import { useNavigation } from '@react-navigation/native';
import { PackedEvent } from 'react-native-calendars/src/timeline/EventBlock';
import { useAuth } from '@presenters/auth/AuthContext';
import useHandleLogout from '@utils/signout';
import { getTalentCalendarPerDayBackgroundColor, getTalentTimelineCalendarColor } from '@utils/calendarColors';
import useGetAllTalentBookingsByDate from '@network/useGetAllTalentBookingsByDate';
import EnumStatus from '@models/enums/EnumStatus';
import { getTalentCalendarBackgroundColor } from '@utils/calendarColors';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import CONSTANTS from '@constants/constants';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useGetManagerStatus } from '@network/useGetManagerStatus';

export default function TalentProjectsPerDayView({ route }) {
	const day = route.params?.day;
	const { userId, loginType } = useAuth();
	const { selectedTalent } = useTalentContext();
	const userID = loginType === 'manager' ? selectedTalent?.talent?.user_id : userId;
	const [dateString, setDateString] = useState(day?.dateString);
	const date = dateString.split('-')[2];
	const { data: managerStatus } = useGetManagerStatus();
	const managerId = managerStatus?.data?.manager_talent;
	const { styles, theme } = useStyles(stylesheet);
	const { data: response, isLoading } = useGetAllTalentBookingsByDate(userID!, dateString);
	const data = response?.data;

	const status_code = response?.status;
	const logout = useHandleLogout(false);

	if (status_code == 401) {
		logout();
	}
	const bookings = data || [];

	function onDateChange(value: string) {
		setDateString(value);
	}

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
				<ActivityIndicator color={theme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
			<Header name="">
				<Text size="primaryMid" color="regular" style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, fontWeight: '600', minWidth: '90%' }} textAlign="center">
					{dateString}
				</Text>
			</Header>
			<View style={{ flexDirection: 'row', borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<View style={{ maxWidth: 72, minWidth: 72, borderRightWidth: theme.borderWidth.slim, justifyContent: 'center', alignItems: 'center', paddingVertical: theme.padding.base, borderColor: theme.colors.borderGray }}>
					<Text size="bodyMid" color="muted">
						{moment(dateString, 'YYYY-MM-DD').format('dddd')}
					</Text>
					<Text size="primaryBig" color="regular">
						{date}
					</Text>
				</View>
				<View style={styles.legend}>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
						<View style={styles.dot(EnumStatus.Confirmed)} />
						<Text size="inputLabel" color="regular">
							Confirmed
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
						<View style={styles.dot(EnumStatus.Tentative)} />
						<Text size="inputLabel" color="regular">
							Tentative
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
						<View style={styles.dot(EnumStatus.Enquiry)} />
						<Text size="inputLabel" color="regular">
							Enquiries
						</Text>
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
						<View style={styles.dot(EnumStatus['Blocked'])} />
						<Text size="inputLabel" color="regular">
							Self Block
						</Text>
					</View>
				</View>
			</View>
			{loginType === 'talent' && managerId && (
				<View style={styles.managerAlert}>
					<Text size="bodyMid" color="muted">
						*{' '}
					</Text>
					<Text size="bodySm" color="muted">
						Project Chats, Now Handled by Your Manager
					</Text>
				</View>
			)}
			<TimelineCalendarScreen data={bookings} onDateChange={onDateChange} managerId={managerId} currentDate={dateString} />
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	dot: (status: EnumStatus) => ({
		width: 8,
		height: 8,
		borderRadius: 50,
		backgroundColor: getTalentCalendarBackgroundColor(status),
	}),
	managerAlert: {
		padding: theme.padding.xxs,
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: theme.padding.sm,
	},
	legend: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexShrink: 1,
		width: '100%',
		maxWidth: '100%',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: theme.gap.xxs,
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.base,
	},
}));

const INITIAL_TIME = { hour: 0, minutes: 0 };
const today = new Date();
export const getDate = (offset = 0) => CalendarUtils.getCalendarDateString(new Date().setDate(today.getDate() + offset));

const TimelineCalendarScreen = ({ data, onDateChange, managerId, currentDate }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { subscriptionData } = useSubscription();
	const [eventsByDate, setEventsByDate] = useState({});
	const { permissions } = useAuth();
	const navigation = useNavigation();

	// Update events whenever data or currentDate changes
	useEffect(() => {
		const formattedEvents = data.map(event => {
			const status = event.blocked_project_status || event.status;
			return {
				id: event.project_id,
				start: `${currentDate} ${event.start_time}`,
				end: `${currentDate} ${event.end_time}`,
				status,
				title: event.project_name || event?.title || 'Self Block',
				conversation_id: event.conversation_id,
				producer_id: event.producer_id,
				producer_name: event.producer_name,
				project_name: event.project_name,
				project_id: event.project_id,
				color: getTalentTimelineCalendarColor(status),
			};
		});

		setEventsByDate(groupBy(formattedEvents, e => CalendarUtils.getCalendarDateString(e.start)));
	}, [data, currentDate]);

	const handleCalenderPopUp = events => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.CALENDAR];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			onEventPress(events);
		}
	};

	function onEventPress(event) {
		if (!event?.conversation_id) return;
		if (managerId) return;
		navigation.navigate('ProjectConversation', { receiver_id: event?.producer_id, project_id: event?.project_id, id: event?.conversation_id });
	}

	const timelineProps: Partial<TimelineProps> = {
		format24h: true,
		start: 0,
		end: 24,
		renderEvent: CustomEventMarker,
		styles: {
			calendarBackground: 'black',
			eventTitle: {
				color: darkTheme.colors.typography,
			},
			eventSummary: {
				color: darkTheme.colors.typography,
			},
			eventTimes: {
				color: darkTheme.colors.typography,
			},
			event: {
				borderWidth: 0,
				paddingTop: 0,
			},
			line: {
				backgroundColor: darkTheme.colors.borderGray,
				width: darkTheme.borderWidth.slim,
			},
			verticalLine: {
				backgroundColor: darkTheme.colors.borderGray,
				width: darkTheme.borderWidth.slim,
			},
			timeLabel: {
				color: darkTheme.colors.borderGray,
			},
		},
		rightEdgeSpacing: darkTheme.padding.base,
		onEventPress: handleCalenderPopUp,
	};

	return (
		<CalendarProvider onDateChanged={onDateChange} date={currentDate} style={{ backgroundColor: darkTheme.colors.black }} disabledOpacity={0.6}>
			<TimelineList events={eventsByDate} timelineProps={timelineProps} scrollToFirst initialTime={INITIAL_TIME} />
		</CalendarProvider>
	);
};

function CustomEventMarker(event: PackedEvent) {
	const { styles } = useStyles(stylesheet2);
	return (
		<View style={styles.container(event)}>
			<View style={styles.eventMarker(event, event?.blocked_project_status || event?.status)}></View>
			<Text size="bodyMid" numberOfLines={1} style={styles.normalText}>
				{event.title}
			</Text>
			<Text size="bodySm" color="muted">
				{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
			</Text>
		</View>
	);
}

const stylesheet2 = createStyleSheet(theme => ({
	container: event => ({
		paddingLeft: darkTheme.padding.base,
		height: event.height,
		borderWidth: 0,
		width: event.width,
		backgroundColor: event.color,
	}),

	normalText: { paddingTop: darkTheme.padding.xxs, color: theme.colors.typography },
	eventMarker: (event, status: EnumStatus) => ({
		position: 'absolute',
		left: -5,
		top: -5,
		width: darkTheme.padding.xxs,
		height: event.height + 5,
		backgroundColor: getTalentCalendarPerDayBackgroundColor(status),
	}),
}));
