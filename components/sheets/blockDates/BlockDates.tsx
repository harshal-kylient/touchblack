import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { parseISO, isValid } from 'date-fns';
import * as z from 'zod';

import FormSchema, { Reason } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Select from '@components/Select';
import { Calendar, Radio, RadioFilled, Timer } from '@touchblack/icons';
import enumToArray from '@utils/enumToArray';
import ProjectStatus from '@models/enums/ProjectStatus';
import Header from '@components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHourPicker from '../dateTimePicker/HourPicker';
import Modal from '@components/Modal';
import CustomDatePicker, { transform } from '../dateTimePicker/DateTimePicker';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useAuth } from '@presenters/auth/AuthContext';

const BlockDates = ({ route }) => {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const payload = route?.params?.payload;
	const existingData = payload?.existingData;
	const queryClient = useQueryClient();
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const [fromTimeVisible, setFromTimeVisible] = useState(false);
	const [toTimeVisible, setToTimeVisible] = useState(false);

	const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
	const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
	const { selectedTalent } = useTalentContext();
	const { loginType } = useAuth();
	const talent_id = selectedTalent?.talent?.user_id;

	const formatDate = useCallback((dateString: string) => {
		if (!dateString) {
			return undefined;
		}
		const parsedDate = parseISO(dateString);
		return isValid(parsedDate) ? parsedDate : undefined;
	}, []);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
			setScreenHeight(CONSTANTS.screenHeight - event.endCoordinates.height - headerHeight - bottomHeight - insets.top - insets.bottom);
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setScreenHeight(CONSTANTS.screenHeight);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	const handleLayout2 = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setBottomHeight(height);
	};

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			reason: Reason.Project,
			project_name: '',
			title: '',
			project_status: null,
			from_date: undefined,
			to_date: undefined,
			full_day: false,
			from_time: '',
			to_time: '',
			notes: '',
		},
	});

	useEffect(() => {
		if (existingData) {
			form.reset({
				reason: existingData?.blocked_reason_type,
				title: existingData?.title,
				project_name: existingData?.project_name,
				project_status: existingData?.blocked_project_status,
				from_date: existingData.startDate,
				to_date: existingData.endDate,
				full_day: existingData.startTime === '00:00' && existingData.endTime === '23:59',
				from_time: existingData.startTime,
				to_time: existingData.endTime,
				notes: existingData.notes || '',
			});
		}
	}, [existingData, form, formatDate]);

	const handleInputChange = useCallback((text: string, field: any) => {
		setServerError('');
		field.onChange(text);
	}, []);

	const onSubmit = useCallback(
		async (data: z.infer<typeof FormSchema>) => {
			const from_time = data.full_day ? '00:00' : data.from_time;
			const to_time = data.full_day ? '23:59' : data.to_time;

			try {
				if (existingData) {
					let url = CONSTANTS.endpoints.update_talent_blocked_dates(existingData?.startDate, existingData?.endDate, existingData?.startTime, existingData?.endTime, data.from_date, data.to_date, from_time!, to_time!, data.notes, data?.title || data?.project_name, data?.reason, data?.project_status?.name);

					if (loginType === 'manager') {
						url += `&talent_id=${talent_id}`;
					}
					const response = await server.put(url);
					if (!response.data?.success) {
						setServerError(response.data?.message);
						return;
					}
					queryClient.invalidateQueries(['useGetBlackoutDates', new Date().getFullYear()]);
				} else {
					let url = CONSTANTS.endpoints.block_talent_dates(data.from_date, data.to_date, from_time!, to_time!, data.notes, data?.title || data?.project_name, data?.reason, data?.project_status?.name);
					if (loginType === 'manager') {
						url += `&talent_id=${talent_id}`;
					}
					const response = await server.post(url);
					if (!response.data?.success) {
						setServerError(response.data?.message);
						return;
					}
					queryClient.invalidateQueries(['useGetBlackoutDates', new Date().getFullYear()]);
				}
				navigation.goBack();
			} catch (error) {
				setServerError(String(error));
			}
		},
		[existingData],
	);

	const toggleFromDatePicker = () => {
		setIsFromDatePickerOpen(!isFromDatePickerOpen);
	};

	function getFormattedTime(date: Date | null | undefined) {
		if (!date) {
			return undefined;
		}

		const formattedTime = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
		return formattedTime !== 'Invalid date' ? formattedTime : undefined;
	}

	const toggleToDatePicker = () => {
		setIsToDatePickerOpen(!isToDatePickerOpen);
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header onLayout={handleLayout} name={existingData ? 'Edit Blocked Dates' : 'Block Dates in Calendar'} />
			<View style={styles.formContainer(screenHeight)}>
				<Form {...form}>
					<ScrollView contentContainerStyle={styles.xxlgap}>
						<FormField
							control={form.control}
							name="reason"
							render={({ field }) => (
								<FormItem>
									<FormLabel style={styles.formLabel}>Reason</FormLabel>
									<FormControl>
										<View style={styles.tabContainer}>
											<Pressable onPress={() => field.onChange('project')} style={[styles.tab, styles.borderL]}>
												{field.value === 'project' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
												<Text size="secondary" color="regular">
													Project
												</Text>
											</Pressable>
											<Pressable onPress={() => field.onChange('personal')} style={styles.tab}>
												{field.value === 'personal' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
												<Text size="secondary" color="regular">
													Personal
												</Text>
											</Pressable>
										</View>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<View style={styles.gapBase}>
							{form.watch('reason') === Reason.Personal && (
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem style={styles.pBase}>
											<FormLabel>Title</FormLabel>
											<FormControl>
												<TextInput placeholder="title" value={field.value} onChangeText={field.onChange} style={[styles.textinput, styles.disabledInput(false), styles.inputPadding, styles.borderGray]} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{form.watch('reason') === Reason.Project && (
								<FormField
									control={form.control}
									name="project_name"
									render={({ field }) => (
										<FormItem style={styles.pBase}>
											<FormLabel>Project Name</FormLabel>
											<FormControl>
												<TextInput placeholder="Enter project name" value={field.value} onChangeText={field.onChange} style={[styles.textinput, styles.disabledInput(false), styles.inputPadding, { borderColor: theme.colors.borderGray }]} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{form.watch('reason') === Reason.Project && (
								<FormField
									control={form.control}
									name="project_status"
									render={({ field }) => (
										<FormItem style={styles.pBase}>
											<FormLabel>Project Status</FormLabel>
											<FormControl>
												<Select value={field.value} onChange={field.onChange} items={enumToArray(ProjectStatus)} placeholder="Select project status" itemsToShow={3} selectStyle={{ backgroundColor: theme.colors.backgroundDarkBlack }} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<View style={styles.datesContainer}>
								<FormField
									control={form.control}
									name="from_date"
									render={({ field: { onChange, value } }) => (
										<FormItem style={{ justifyContent: 'flex-end', flex: 1 }}>
											<FormLabel>From Date</FormLabel>
											<FormControl>
												<View style={{ flexDirection: 'row', gap: theme.gap.xxs }}>
													<Pressable onPress={toggleFromDatePicker} style={[styles.textinput, { minWidth: '100%', paddingVertical: theme.padding.xxs, borderColor: theme.colors.borderGray, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, paddingRight: theme.padding.base, flex: 1 }]}>
														<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={getFormattedTime(value) ? 'regular' : 'muted'} size="bodyMid">
															{getFormattedTime(value) || 'From Date'}
														</Text>
														<Calendar color="none" strokeColor={theme.colors.typography} strokeWidth={3} size="22" />
													</Pressable>
												</View>
											</FormControl>
											<Modal
												visible={isFromDatePickerOpen}
												onDismiss={() => {
													setIsFromDatePickerOpen(false);
												}}>
												<CustomDatePicker
													value={transform(value)}
													onDismiss={() => setIsFromDatePickerOpen(false)}
													onSelect={({ date, year, month }) => {
														setIsFromDatePickerOpen(false);
														onChange(`${year}-${month}-${date}`);
													}}
												/>
											</Modal>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="to_date"
									render={({ field: { onChange, value } }) => (
										<FormItem style={{ flex: 1 }}>
											<FormLabel>To Date</FormLabel>
											<FormControl>
												<Pressable onPress={toggleToDatePicker} style={[styles.textinput, { paddingVertical: theme.padding.xxs, borderColor: theme.colors.borderGray, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, paddingRight: theme.padding.base, flex: 1 }]}>
													<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={getFormattedTime(value) ? 'regular' : 'muted'} size="bodyMid">
														{getFormattedTime(value) || 'To Date'}
													</Text>
													<Calendar color="none" strokeColor={theme.colors.typography} strokeWidth={3} size="22" />
												</Pressable>
											</FormControl>
											<Modal
												visible={isToDatePickerOpen}
												onDismiss={() => {
													setIsToDatePickerOpen(false);
												}}>
												<CustomDatePicker
													value={transform(value)}
													onDismiss={() => setIsToDatePickerOpen(false)}
													onSelect={({ date, year, month }) => {
														setIsToDatePickerOpen(false);
														onChange(`${year}-${month}-${date}`);
													}}
												/>
											</Modal>
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
														Full-day
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
											<FormLabel style={{ fontSize: theme.fontSize.typographySm }}>From Time</FormLabel>
											<FormControl>
												<View style={{ flexDirection: 'row', gap: theme.gap.xxs }}>
													<Pressable disabled={form.watch('full_day')} onPress={() => setFromTimeVisible(true)} style={[styles.textinput, { minWidth: '100%', borderColor: theme.colors.borderGray, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, paddingRight: theme.padding.base, flex: 1 }]}>
														<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={value && !form.watch('full_day') ? 'regular' : 'muted'} size="bodyMid">
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
														<Text style={{ flex: 1, fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.xs }} color={value && !form.watch('full_day') ? 'regular' : 'muted'} size="bodyMid">
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
						</View>
						{form.getFieldState('from_date').error?.message || form.getFieldState('to_date').error?.message ? (
							<Text style={{ paddingHorizontal: theme.padding.base }} size="bodySm" color="error">
								{form.getFieldState('from_date').error?.message || form.getFieldState('to_date').error?.message}
							</Text>
						) : null}
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<TextInput
											multiline
											value={field.value}
											onChangeText={v => handleInputChange(v, field)}
											placeholder="Write your thoughts here..."
											placeholderTextColor={theme.colors.typographyLight}
											style={[
												styles.textinput,
												{
													borderColor: serverError || form.formState.errors.notes ? theme.colors.destructive : theme.colors.borderGray,
													paddingTop: theme.padding.base,
													minHeight: 70,
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</ScrollView>
					{serverError ? (
						<Text size="bodyMid" color="error" style={styles.errorText}>
							{serverError}
						</Text>
					) : null}
					<View style={styles.footer}>
						<Button onPress={navigation.goBack} type="secondary" textColor="regular" style={styles.widthHalf}>
							Cancel
						</Button>
						<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
							{existingData?.id ? 'Update' : 'Block'}
						</Button>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
};

export default BlockDates;

const stylesheet = createStyleSheet(theme => ({
	container: { flex: 1, backgroundColor: theme.colors.backgroundDarkBlack },
	formContainer: (height: number) => ({ flex: 1, justifyContent: 'space-between', maxHeight: height }),
	formLabel: { paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.xxs },
	tabContainer: { borderTopWidth: theme.borderWidth.slim, paddingHorizontal: theme.padding.base, flexDirection: 'row', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	tab: { padding: theme.padding.base, flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	borderL: { borderLeftWidth: theme.borderWidth.slim },
	pBase: { paddingHorizontal: theme.padding.base },
	borderGray: { borderColor: theme.colors.borderGray },
	disabledInput: (disabled: boolean) => ({
		backgroundColor: disabled ? '#292929' : theme.colors.black,
	}),
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	textArea: {
		height: 80,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	xxlgap: { gap: theme.gap.xxl },
	xxxlBottomMargin: { marginBottom: theme.margins.xxxl },
	baseMargin: { margin: theme.margins.base },
	widthHalf: {
		width: '50%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	fileInputContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.xxxxl,
		paddingVertical: theme.padding.xxxxl,
		backgroundColor: theme.colors.black,
	},
	fileInputHeader: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
		color: theme.colors.borderGray,
	},
	fileInputText: {
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.borderGray,
	},
	gapBase: {
		gap: theme.gap.base,
	},
	datesContainer: {
		gap: theme.gap.base,
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
	},
	errorText: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
	},
}));
