import { Pressable, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars';
import { DateData } from 'react-native-calendars';

import { ArrowLeft, ArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import { MarkedDates } from 'react-native-calendars/src/types';
import { useState } from 'react';
import moment from 'moment';
import CONSTANTS from '@constants/constants';
import MyCalendarHeader from '@presenters/projects/MyCalendarHeader';

interface IProps {
	value: string[];
	onChange: (dates: string[]) => void;
	onDismiss: () => void;
}

const CustomDay = ({ date, state, marking, onPress }: { date: DateData; state: string; marking: unknown; onPress: (date: DateData) => void }) => {
	const { styles } = useStyles(stylesheet);
	const isSelected = marking && marking.selected;
	const isToday = state === 'today';

	return (
		<Pressable onPress={() => onPress(date)} style={styles.dayStyle(isSelected)}>
			<Text size="bodyBig" style={styles.textStyle(state, isToday)}>
				{date.day}
			</Text>
		</Pressable>
	);
};

function structureDates(dates: string[]): MarkedDates {
	const structuredDates: MarkedDates = {};
	dates?.forEach(it => (structuredDates[it] = { selected: true }));
	return structuredDates;
}

export default function Calendar({ value, onChange, onDismiss }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [localSelectedDates, setLocalSelectedDates] = useState<MarkedDates>(structureDates(value));
	const [message, setMessage] = useState('');

	LocaleConfig.locales.en = CONSTANTS.enLocaleCalendarConfig;
	LocaleConfig.defaultLocale = 'en';

	const calendarTheme = {
		calendarBackground: theme.colors.backgroundDarkBlack,
		textSectionTitleColor: theme.colors.muted,
		selectedDayBackgroundColor: theme.colors.destructive,
		selectedDayTextColor: theme.colors.typography,
		todayTextColor: theme.colors.primary,
		dayTextColor: theme.colors.muted,
		textDisabledColor: theme.colors.muted,
		dotColor: theme.colors.destructive,
		selectedDotColor: theme.colors.destructive,
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
				height: UnistylesRuntime.screen.width / 7,
			},
			monthView: {
				backgroundColor: theme.colors.backgroundDarkBlack,
			},
			week: {
				flexDirection: 'row',
				justifyContent: 'space-around',
				marginVertical: 0,
				borderRightWidth: theme.borderWidth.slim,
				borderColor: theme.colors.borderGray,
			},
		},
		'stylesheet.calendar.header': {
			dayHeader: {
				paddingVertical: theme.padding.xs,
				width: UnistylesRuntime.screen.width / 7,
				borderRightWidth: theme.borderWidth.slim,
				borderBottomWidth: theme.borderWidth.slim,
				borderColor: theme.colors.borderGray,
				textAlign: 'center',
				fontSize: theme.fontSize.typographyMd,
				fontFamily: theme.fontFamily.cgRegular,
				fontWeight: theme.fontWeight.regular,
				color: theme.colors.typography,
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
	};

	function onSetDates(dates: MarkedDates) {
		const currentDates = Array.from(Object.keys(dates));
		if (!currentDates.length) {
			setMessage('Please select a date');
		}
		onChange(currentDates);
	}

	const onDayPress = (day: DateData) => {
		setMessage('');
		const updatedSelectedDates = { ...localSelectedDates };

		if (updatedSelectedDates[day.dateString]) {
			delete updatedSelectedDates[day.dateString];
		} else {
			updatedSelectedDates[day.dateString] = {
				selected: true,
			};
		}
		setLocalSelectedDates(updatedSelectedDates);
		onSetDates(updatedSelectedDates);
	};

	return (
		<View style={styles.contentContainer}>
			<CalendarComponent customHeader={props => <MyCalendarHeader {...props} />} onDayPress={onDayPress} minDate={moment().format('YYYY-MM-DD')} disableAllTouchEventsForDisabledDays={true} hideExtraDays={true} markingType="custom" markedDates={localSelectedDates} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={CustomDay} />
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		position: 'absolute',
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
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
		width: UnistylesRuntime.screen.width / 7 - 4,
		height: UnistylesRuntime.screen.width / 7,
	}),
	textStyle: (state: string, isToday: boolean) => ({
		color: state === 'disabled' ? theme.colors.muted : theme.colors.typography,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
}));
