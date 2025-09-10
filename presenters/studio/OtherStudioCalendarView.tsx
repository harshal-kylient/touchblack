import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';

import { useNavigation } from '@react-navigation/native';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import useGetStudioCalendarList from '@network/useGetStudioCalendarList';
import { useStudioBookingContext } from './booking/StudioContext';
import Header from '@components/Header';
import { OtherDay } from './day/OtherDay';
import { getStudioCalendarBackgroundColor } from '@utils/calendarColors';
import { useAuth } from '@presenters/auth/AuthContext';

export default function OtherStudioCalendarView({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const studioId = route.params?.id;
	const studioName = route.params?.name;
	const shortlist = route.params?.shortlist;
	const studio = route.params?.studio;
	const { permissions, loginType } = useAuth();

	const screenHeight = UnistylesRuntime.screen.height;
	const navigation = useNavigation();
	const { dispatch } = useStudioBookingContext();

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
	const { data: response } = useGetStudioCalendarList(studioId, formattedMonth);
	const producer_projects = response?.data;

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
					height: (UnistylesRuntime.screen.height - (Platform.OS === 'android' && shortlist ? 80 : Platform.OS === 'android' ? 37 : shortlist ? 84 : 40) - (Platform.OS === 'android' ? 45 : 90) - (Platform.OS === 'android' ? 3 : 4) * 43) / 6,
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

	function handleShortlist() {
		dispatch({ type: 'ADD_STUDIO_FLOOR', value: studio });
		navigation.navigate('StudioBookingStep1', { direct_studio_booking: true });
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name={studioName + "'s Calendar"} />
			<ScrollView style={styles.container}>
				<Calendar onMonthChange={handleMonthChange} hideExtraDays={false} showSixWeeks={true} markingType="custom" markedDates={markedDates} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={OtherDay} />
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
			{/* {shortlist && (
				<View style={{ flex: 1, backgroundColor: theme.colors.black, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, position: 'absolute', bottom: 20, minWidth: '100%' }}>
					<Button onPress={handleShortlist} type={loginType === 'producer' && permissions?.includes('Project::Edit') ? 'primary' : 'inline'} textColor={loginType === 'producer' && permissions?.includes('Project::Edit') ? 'black' : 'muted'} style={styles.button(loginType === 'producer' ? !permissions?.includes('Project::Edit') : false)} isDisabled={loginType === 'producer' ? !permissions?.includes('Project::Edit') : false}>
						Shortlist
					</Button>
				</View>
			)} */}
		</SafeAreaView>
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
	button: (isDisabled: boolean = false) => ({
		width: '100%',
		borderWidth: theme.borderWidth.slim,
		borderColor: isDisabled ? theme.colors.muted : theme.colors.primary,
	}),
}));
