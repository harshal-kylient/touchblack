import { useMemo, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import { Day } from './day/Day';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import { IStatus } from '@models/entities/IStatus';
import useGetProjectsCalendarList from '@network/useGetProjectsCalendarList';
import { useNavigation } from '@react-navigation/native';
import Header from '@components/Header';
import { getProjectCalendarBackgroundColor } from '@utils/calendarColors';

interface IMarkedDates {
	completedCount?: number;
	liveCount?: number;
	totalCount?: number;
	confirmedCount?: number;
	enquiryCount?: number;
	blackoutCount?: number;
}

const ProjectCalendarView = ({ route }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, userId } = useAuth();
	const screenHeight = UnistylesRuntime.screen.height;
	const id = route?.params?.talent_id;
	const name = route?.params?.name;
	const talent_id = id || userId;

	const projectHeaderHeight = screenHeight * 0.11;
	const calendarHeaderHeight = screenHeight * 0.104;
	const legendHeight = screenHeight * 0.0376;
	const tabNavigatorHeight = screenHeight * 0.0738;
	const remainingHeight = screenHeight - (projectHeaderHeight + calendarHeaderHeight + legendHeight + tabNavigatorHeight);
	const height = remainingHeight / 6.25;
	const navigation = useNavigation();

	const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
	const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
	const formattedMonth = `${currentYear}-${currentMonth < 10 ? '0' : ''}${currentMonth}`;
	const markedDates = useGetProjectsCalendarList(formattedMonth, talent_id);

	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);

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
					height: height,
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

	const handleDayPress = (day: DateData) => {
		if (talent_id !== userId) return;
		navigation.navigate('DayWiseProjectCalendarView', { day });
	};

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

	const handleMonthChange = (month: { year: number; month: number }) => {
		setCurrentYear(month.year);
		setCurrentMonth(month.month);
	};

	return (
		<SafeAreaView style={styles.container}>
			{talent_id !== userId && <Header name={`${name ? name + "'s" : 'My'} Calendar`} />}
			<Calendar onMonthChange={handleMonthChange} onDayPress={handleDayPress} hideExtraDays={true} markingType="custom" markedDates={markedDates} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={Day} />
			<View style={styles.legend}>
				{userType === 'Producer' ? (
					<>
						<View style={styles.dot('Completed')} />
						<Text size="inputLabel" color="regular">
							Completed Projects
						</Text>
						<View style={styles.dot('Ongoing')} />
						<Text size="inputLabel" color="regular">
							Live Projects
						</Text>
					</>
				) : (
					<>
						<View style={styles.dot('Confirmed')} />
						<Text size="inputLabel" color="regular">
							Confirmed
						</Text>
						<View style={styles.dot('Enquiry')} />
						<Text size="inputLabel" color="regular">
							Enquiry
						</Text>
						<View style={styles.dot('Blackout')} />
						<Text size="inputLabel" color="regular">
							Blackout
						</Text>
					</>
				)}
			</View>
		</SafeAreaView>
	);
};

export default ProjectCalendarView;

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
		backgroundColor: getProjectCalendarBackgroundColor(status),
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
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
