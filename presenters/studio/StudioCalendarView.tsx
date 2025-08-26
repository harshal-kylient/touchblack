import { useCallback, useMemo, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import { Day } from './day/Day';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import useGetStudioCalendarList from '@network/useGetStudioCalendarList';
import { useStudioContext } from './StudioContext';
import useHandleLogout from '@utils/signout';
import { getStudioCalendarBackgroundColor } from '@utils/calendarColors';
import MyCalendarHeader from '@presenters/projects/MyCalendarHeader';

export default function StudioCalendarView() {
	const { styles, theme } = useStyles(stylesheet);
	const { studioFloor } = useStudioContext();
	const screenHeight = UnistylesRuntime.screen.height;
	const navigation = useNavigation();

	// heights of elements of the calendar
	const projectHeaderHeight = 40;
	const calendarHeaderHeight = 44;
	const legendHeight = 0;
	const tabNavigatorHeight = 80;
	const remainingHeight = screenHeight - (projectHeaderHeight + calendarHeaderHeight + legendHeight + tabNavigatorHeight);
	const height = remainingHeight / 6.25;

	// year month formatting
	const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
	const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
	const formattedMonth = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;

	// network call to get projects data
	const { data: response, refetch } = useGetStudioCalendarList(studioFloor?.id, formattedMonth);
	const producer_projects = response?.data;
	const status_code = response?.status;
	const logout = useHandleLogout(false);
	useFocusEffect(
		useCallback(() => {
			refetch();
		}, [refetch]),
	);

	if (status_code == 401) {
		logout();
	}

	const markedDates = producer_projects?.reduce((acc, { date, confirmed, enquiry, tentative, not_available, blocked, completed }) => {
		acc[date] = {
			completedCount: completed,
			totalCount: completed + confirmed + enquiry + tentative,
			confirmedCount: confirmed,
			tentativeCount: tentative,
			enquiryCount: enquiry,
			blackoutCount: blocked,
		};
		return acc;
	}, {});

	// setting up calendar's theme & naming conventions
	LocaleConfig.locales.en = {
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		today: 'Today',
	};
	LocaleConfig.defaultLocale = 'en';

	const calendarTheme = useMemo(
		() => ({
			calendarBackground: theme.colors.backgroundDarkBlack,
			textSectionTitleColor: theme.colors.muted,
			selectedDayTextColor: theme.colors.typography,
			todayTextColor: theme.colors.typography,
			dayTextColor: theme.colors.typographyLight,
			textDisabledColor: theme.colors.muted,
			arrowColor: theme.colors.typography,
			monthTextColor: theme.colors.typography,
			'stylesheet.calendar.main': {
				container: {
					paddingLeft: 0,
					paddingRight: 0,
					marginHorizontal: 0,
					gap: 0,
				},
				emptyDayContainer: {
					borderRightWidth: theme.borderWidth.slim,
					borderBottomWidth: theme.borderWidth.slim,
					borderColor: theme.colors.borderGray,
					flex: 1,
				},
				dayContainer: {
					flex: 1,
					borderRightWidth: theme.borderWidth.slim,
					borderBottomWidth: theme.borderWidth.slim,
					borderColor: theme.colors.borderGray,
					width: UnistylesRuntime.screen.width / 7,
					height: (UnistylesRuntime.screen.height - (Platform.OS === 'android' ? 57 : 60) - (Platform.OS === 'android' ? 45 : 90) - (Platform.OS === 'android' ? 3 : 4) * 43) / 6,
				},
				monthView: {
					backgroundColor: theme.colors.backgroundDarkBlack,
				},
				week: {
					flexDirection: 'row',
					justifyContent: 'space-around',
					marginVertical: 0,
				},
			},
			'stylesheet.calendar.header': {
				dayHeader: {
					marginTop: theme.margins.base,
					paddingVertical: theme.padding.xxxs,
					width: UnistylesRuntime.screen.width / 7,
					marginBottom: 1, // for border to be visible
					borderRightWidth: theme.borderWidth.slim,
					borderBottomWidth: theme.borderWidth.slim,
					borderColor: theme.colors.borderGray,
					textAlign: 'center',
					fontSize: theme.fontSize.typographyMd,
					fontFamily: theme.fontFamily.cgRegular,
					fontWeight: theme.fontWeight.regular,
					color: theme.colors.typographyLight,
				},
				monthText: {
					fontSize: theme.fontSize.primaryH2,
					color: theme.colors.typography,
				},
				header: {
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: theme.gap.xxs,
				},
			},
		}),
		[theme, height],
	);

	// on day press we'd redirect the producer to Day specific calendar screen
	const handleDayPress = (day: DateData) => {
		const counts = markedDates[day.dateString];
		if (counts?.blackoutCount || counts?.completedCount || counts?.confirmedCount || counts?.enquiryCount || counts?.tentativeCount || counts?.totalCount) {
			navigation.navigate('StudioProjectsPerDayView', { day });
		}
	};

	// some unused code, is garbage, TODO: throw it
	const getDayOfWeek = (dateString: string): string => {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const date = new Date(dateString);
		return days[date.getDay()];
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);

		// if month is less than 10, add 0
		if (date.getMonth() < 10) {
			return `${date.getDate()}.0${date.getMonth() + 1}`;
		}
		return `${date.getDate()}.${date.getMonth() + 1}`;
	};

	const getMonth = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleString('en-US', { month: 'long' });
	};

	// whenever month changes we gotta change the month, year state, so we can easily fetch the data for the changed period
	const handleMonthChange = (month: { year: number; month: number }) => {
		setCurrentYear(month.year);
		setCurrentMonth(month.month);
	};

	return (
		<ScrollView style={styles.container}>
			<Calendar customHeader={props => <MyCalendarHeader {...props} />} onMonthChange={handleMonthChange} onDayPress={handleDayPress} hideExtraDays={false} showSixWeeks={true} markingType="custom" markedDates={markedDates} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={Day} />
			<View style={styles.legend}>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
					<View style={styles.dot(EnumStudioStatus.Confirmed)} />
					<Text size="inputLabel" color="regular">
						Confirmed Bookings
					</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
					<View style={styles.dot(EnumStudioStatus.Tentative)} />
					<Text size="inputLabel" color="regular">
						Tentative Bookings
					</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
					<View style={styles.dot(EnumStudioStatus.Enquiry)} />
					<Text size="inputLabel" color="regular">
						Enquiries
					</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
					<View style={styles.dot(EnumStudioStatus.Completed)} />
					<Text size="inputLabel" color="regular">
						Completed Bookings
					</Text>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
					<View style={styles.dot(EnumStudioStatus['Not available'])} />
					<Text size="inputLabel" color="regular">
						Self Block
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		position: 'relative',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	dot: (status: EnumStudioStatus) => ({
		width: 8,
		height: 8,
		borderRadius: 50,
		backgroundColor: getStudioCalendarBackgroundColor(status),
	}),
	legend: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexShrink: 1,
		width: '100%',
		maxWidth: '100%',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: theme.gap.xxs,
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
