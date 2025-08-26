import { useMemo, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import { IStatus } from '@models/entities/IStatus';
import { useNavigation } from '@react-navigation/native';
import useGetTalentCalendarList from '@network/useGetTalentCalendarList';
import transformTalentCalendarResponse from '@utils/transformTalentCalendarResponse';
import Header from '@components/Header';
import { OtherDay } from './day/OtherDay';
import { getTalentCalendarBackgroundColor } from '@utils/calendarColors';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useAuth } from '@presenters/auth/AuthContext';
import MyCalendarHeader from './MyCalendarHeader';

interface IMarkedDates {
	completedCount?: number;
	liveCount?: number;
	totalCount?: number;
	confirmedCount?: number;
	enquiryCount?: number;
	blackoutCount?: number;
}

export default function OtherTalentCalendarView({ route }) {
	const talent_id = route?.params?.talent_id;
	const name = route?.params?.name;
	const { loginType } = useAuth();
	const { selectedTalent } = useTalentContext();
	const userId = loginType === 'manager' ? selectedTalent?.talent?.user_id : talent_id;
	const { styles, theme } = useStyles(stylesheet);
	const screenHeight = UnistylesRuntime.screen.height;
	const navigation = useNavigation();

	// heights of elements of the calendar
	const projectHeaderHeight = 40;
	const calendarHeaderHeight = 44;
	const legendHeight = 0;
	const tabNavigatorHeight = 80;
	const remainingHeight = screenHeight - (projectHeaderHeight + calendarHeaderHeight + legendHeight + tabNavigatorHeight);
	const height = remainingHeight / 6;

	// year month formatting
	const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
	const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
	const formattedMonth = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;

	// network call to get projects data
	const { data: talent_projects } = useGetTalentCalendarList(userId!, formattedMonth);
	const markedDates = transformTalentCalendarResponse(talent_projects);

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
					height: (UnistylesRuntime.screen.height - (Platform.OS === 'android' ? 45 : 90) - (Platform.OS === 'android' ? 3 : 4) * 44) / 6,
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

	const handleDayPress = (day: DateData) => {};

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
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.container}>
				<Header name={`${name + "'s"} Calendar`} />
				<Calendar customHeader={props => <MyCalendarHeader {...props} />} onMonthChange={handleMonthChange} onDayPress={handleDayPress} hideExtraDays={false} showSixWeeks={true} markingType="custom" markedDates={markedDates} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={props => <OtherDay talent_id={talent_id} {...props} />} />
				<View style={styles.legend}>
					<View style={styles.dot('Confirmed')} />
					<Text size="inputLabel" color="regular">
						Confirmed
					</Text>
					<View style={styles.dot('Tentative')} />
					<Text size="inputLabel" color="regular">
						Tentative
					</Text>
					<View style={styles.dot('Enquiry')} />
					<Text size="inputLabel" color="regular">
						Enquiry
					</Text>
					<View style={styles.dot('Blackout')} />
					<Text size="inputLabel" color="regular">
						Blackout
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		position: 'relative',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	dot: (status: IStatus) => ({
		width: 8,
		height: 8,
		borderRadius: 50,
		borderColor: theme.colors.typography,
		backgroundColor: getTalentCalendarBackgroundColor(status),
	}),
	legend: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexShrink: 1,
		width: '100%',
		alignItems: 'center',
		gap: theme.gap.xxs,
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
