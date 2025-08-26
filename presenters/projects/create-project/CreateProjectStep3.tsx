import { Pressable, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars';
import { DateData } from 'react-native-calendars';

import { ArrowLeft, ArrowRight, Timer } from '@touchblack/icons';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text } from '@touchblack/ui';

import { MarkedDates } from 'react-native-calendars/src/types';
import { ReactElement, useState } from 'react';
import IValueWithId from '@models/entities/IValueWithId';
import moment from 'moment';
import CONSTANTS from '@constants/constants';
import Header from '@components/Header';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema3 } from './schema';
import { z } from 'zod';
import Modal from '@components/Modal';
import CustomHourPicker from '@components/sheets/dateTimePicker/HourPicker';
import { useNavigation } from '@react-navigation/native';
import MyCalendarHeader from '../MyCalendarHeader';

interface IProps {
	value: { dates: string[]; profession: IValueWithId };
	onChange?: (dates: string[]) => void;
	onDismiss: () => void;
	bottom?: ReactElement;
}

const CustomDay = ({ date, state, marking, onPress }: { date: DateData; state: string; marking: unknown; onPress: (date: DateData) => void }) => {
	const { styles } = useStyles(stylesheet);
	const isSelected = marking && marking.selected;
	const isToday = state === 'today';

	return (
		<Pressable onPress={() => onPress(date)} style={styles.dayStyle(isSelected)}>
			<Text size="bodyBig" style={styles.textStyle(state, isSelected, isToday)}>
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

export default function Calendar({ route }) {
	const value = route?.params?.value;
	const onChange = route?.params?.onChange;
	const { styles, theme } = useStyles(stylesheet);
	const [message, setMessage] = useState('');
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);

	const form = useForm<z.infer<typeof FormSchema3>>({
		resolver: zodResolver(FormSchema3),
		defaultValues: {
			dates: structureDates(value.dates),
			// TODO: change to to & from check
			full_day: value.from_time === '00:00' && value.to_time === '23:59',
			from_time: value.from_time,
			to_time: value.to_time,
		},
	});

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
				width: (CONSTANTS.screenWidth - 2 * theme.padding.base) / 7,
				height: (CONSTANTS.screenWidth - 2 * theme.padding.base) / 7,
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
	};

	function onSubmit(data: z.infer<typeof FormSchema3>) {
		const dates = Array.from(Object.keys(data.dates));
		onChange({
			dates,
			from_time: data.full_day ? '00:00' : data.from_time,
			to_time: data.full_day ? '23:59' : data.to_time,
			profession: value.profession,
		});
	}

	const onDayPress = (value: MarkedDates, onChange: (day: any) => void) => (day: DateData) => {
		setMessage('');
		const updatedSelectedDates = { ...value };
		if (updatedSelectedDates[day.dateString]) {
			delete updatedSelectedDates[day.dateString];
		} else {
			updatedSelectedDates[day.dateString] = {
				selected: true,
			};
		}
		onChange(updatedSelectedDates);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Set Date and Time" style={{ zIndex: -9 }} />
			<Form {...form}>
				<ScrollView style={styles.contentContainer}>
					<View style={styles.calendarHeader}>
						<Text color="muted" size="primarySm">
							Please select the dates, time on which the {value.profession.name} will collaborate with you.
						</Text>
						<FormField
							control={form.control}
							name="dates"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<CalendarComponent  customHeader={props => <MyCalendarHeader {...props} />} onDayPress={onDayPress(field.value, field.onChange)} minDate={moment().format('YYYY-MM-DD')} disableAllTouchEventsForDisabledDays={true} hideExtraDays={true} markingType="custom" markedDates={field.value} renderArrow={(direction: 'left' | 'right') => (direction === 'left' ? <ArrowLeft size="24" /> : <ArrowRight size="24" />)} theme={calendarTheme} dayComponent={CustomDay} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</View>

					<FormField
						control={form.control}
						name="full_day"
						render={({ field }) => (
							<FormItem style={{ marginTop: theme.margins.base }}>
								<FormControl>
									<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.padding.base, paddingHorizontal: theme.padding.base, marginHorizontal: theme.margins.base, borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
											<Text color="regular" size="button">
												Book for Full-day
											</Text>
											<TouchableWithoutFeedback onPress={() => field.onChange(!field.value)} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
												<View style={{ borderRadius: 100, borderColor: !field.value ? 'white' : theme.colors.primary, padding: 2, borderWidth: 2, width: 34, height: 16, alignItems: !field.value ? 'flex-start' : 'flex-end', justifyContent: 'center' }}>
													<View style={{ borderRadius: 100, backgroundColor: !field.value ? 'white' : theme.colors.primary, width: 8, height: 8 }} />
												</View>
											</TouchableWithoutFeedback>
										</View>
									</View>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<View
						style={{
							gap: theme.gap.base,
							paddingHorizontal: theme.padding.base,
							marginTop: theme.margins.base,
							flexDirection: 'row',
						}}>
						<FormField
							control={form.control}
							name="from_time"
							render={({ field: { onChange, value } }) => (
								<FormItem style={{ justifyContent: 'flex-end', flex: 1, gap: 6 }}>
									<FormLabel style={{ fontSize: theme.fontSize.typographyMd }}>From Time</FormLabel>
									<FormControl>
										<View style={{ flexDirection: 'row', gap: theme.gap.xxs }}>
											<Pressable disabled={form.watch('full_day')} onPress={() => setFromTimeVisible(true)} style={[styles.textinput, { minWidth: '100%', borderColor: theme.colors.borderGray, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, paddingRight: theme.padding.base, flex: 1 }]}>
												<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={value && !form.watch('full_day') ? 'regular' : 'muted'} size="button">
													{form.watch('full_day') ? '00:00' : value ? value : 'From Time'}
												</Text>
												<Timer size="24" />
											</Pressable>
										</View>
									</FormControl>
									<FormMessage />
									<Modal visible={fromTimeVisible} onDismiss={() => setFromTimeVisible(false)}>
										<CustomHourPicker
											value={value}
											label="From Time"
											onDismiss={() => setFromTimeVisible(false)}
											onSelect={({ hour }) => {
												onChange(hour);
												setFromTimeVisible(false);
											}}
										/>
									</Modal>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="to_time"
							render={({ field: { onChange, value } }) => (
								<FormItem style={{ justifyContent: 'flex-end', flex: 1, gap: 6 }}>
									<FormLabel style={{ fontSize: theme.fontSize.typographyMd }}>To Time</FormLabel>
									<FormControl>
										<View style={{ flexDirection: 'row', gap: theme.gap.xxs }}>
											<Pressable disabled={form.watch('full_day')} onPress={() => setToTimeVisible(true)} style={[styles.textinput, { minWidth: '100%', borderColor: theme.colors.borderGray, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, paddingRight: theme.padding.base, flex: 1 }]}>
												<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={value && !form.watch('full_day') ? 'regular' : 'muted'} size="button">
													{form.watch('full_day') ? '23:59' : value ? value : 'To Time'}
												</Text>
												<Timer size="24" />
											</Pressable>
										</View>
									</FormControl>
									<FormMessage />
									<Modal visible={toTimeVisible} onDismiss={() => setToTimeVisible(false)}>
										<CustomHourPicker
											label="To Time"
											value={value}
											onDismiss={() => setToTimeVisible(false)}
											onSelect={({ hour }) => {
												onChange(hour);
												setToTimeVisible(false);
											}}
										/>
									</Modal>
								</FormItem>
							)}
						/>
					</View>
				</ScrollView>
				<View style={styles.buttonContainer}>
					{message ? (
						<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							<Text color={'error'} textAlign="center" size="bodyBig">
								{message}
							</Text>
						</Pressable>
					) : null}
					<Button style={styles.buttonSubmit} onPress={form.handleSubmit(onSubmit)}>
						Confirm
					</Button>
				</View>
			</Form>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
		minHeight: 50,
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	contentContainer: {
		flex: 1,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.base,
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
		paddingVertical: theme.padding.lg,
		paddingHorizontal: theme.padding.base,
	},
	buttonSubmit: {
		flexGrow: 1,
	},
	dayStyle: (isSelected: boolean) => ({
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: isSelected ? '#50483b' : 'transparent',
		width: (CONSTANTS.screenWidth - 2 * theme.padding.base) / 7,
		height: (CONSTANTS.screenWidth - 2 * theme.padding.base) / 7,
	}),
	textStyle: (state: string, isSelected: boolean, isToday: boolean) => ({
		color: state === 'disabled' ? theme.colors.muted : isSelected || isToday ? theme.colors.typography : theme.colors.typography,
		fontWeight: isToday ? theme.fontWeight.bold : theme.fontWeight.regular,
	}),
}));
