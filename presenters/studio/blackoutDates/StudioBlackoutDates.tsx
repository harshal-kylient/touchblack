import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { parseISO, isValid } from 'date-fns';
import * as z from 'zod';

import FormSchema, { ReasonType, StudioProjectStatus } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Select from '@components/Select';
import { Calendar, Radio, RadioFilled } from '@touchblack/icons';
import enumToArray from '@utils/enumToArray';
import Header from '@components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Modal from '@components/Modal';
import CustomDatePicker, { transform } from '@components/sheets/dateTimePicker/DateTimePicker';
import capitalized from '@utils/capitalized';

const BlockDates = ({ route }) => {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const { floorId, item } = route.params;
	const queryClient = useQueryClient();
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
	const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);

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
			reason_type: ReasonType.Project,
			title: '',
			blocked_project_status: null,
			from_date: undefined,
			to_date: undefined,
			notes: '',
		},
	});

	useEffect(() => {
		if (item) {
			form.reset({
				reason_type: (item.reason_type as ReasonType) || ReasonType.Project,
				blocked_project_status: item?.blocked_project_status ? { id: capitalized(item?.blocked_project_status), name: capitalized(item?.blocked_project_status) } : null,
				title: item.title || '',
				from_date: item.start_date || moment().format('YYYY-MM-DD'),
				to_date: item.end_date || moment().format('YYYY-MM-DD'),
				notes: item.notes || '',
			});
		}
	}, [item, form]);

	const handleInputChange = useCallback((text: string, field: any) => {
		setServerError('');
		field.onChange(text);
	}, []);

	const convertDateString = useCallback((dateStr: string) => {
		return moment(dateStr, 'YYYY-MM-DD').format('DD/MM/YYYY');
	}, []);

	const mutationFunction = async (data: unknown) => {
		const response = await server.post(CONSTANTS.endpoints.studio_floor_block_dates(floorId), data);
		return response.data;
	};

	const mutation = useMutation({
		mutationFn: mutationFunction,
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: ['useGetStudioFloorBlockedDates', floorId] });
			if (data && data.success === false) {
				setServerError(data.message || 'An error occurred while saving the data.');
			} else {
				navigation.goBack();
			}
		},
		onError: error => {
			setServerError(error.message || 'An unexpected error occurred. Please try again.');
		},
	});

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		setServerError('');
		if (item) {
			const payload = {
				studio_floor_id: floorId,
				old_reason_type: item.reason_type,
				old_title: item.title,
				old_start_date: moment(item.start_date).format('DD/MM/YYYY'),
				old_end_date: moment(item.end_date).format('DD/MM/YYYY'),
				old_notes: item.notes,

				new_reason_type: data.reason_type,
				new_title: data.title,
				new_start_date: convertDateString(data.from_date),
				new_end_date: convertDateString(data.to_date),
				blocked_project_status: data.blocked_project_status?.id?.toLowerCase(),
				// data.all_day && moment(data.start_date, 'DD/MM/YYYY').format('DD/MM/YYYY') === moment().format('DD/MM/YYYY') ? moment().format('HH:mm') :
				new_notes: data.notes,
			};

			const res = await server.post(CONSTANTS.endpoints.studio_edit_block_dates, payload);
			if (!res.data?.success) {
				setServerError(res.data?.message || 'An error occurred while saving the data.');
			} else {
				queryClient.invalidateQueries({ queryKey: ['useGetStudioFloorBlockedDates', floorId] });
				navigation.goBack();
				return;
			}
		}

		const formattedData = {
			studio_floor_id: floorId,
			start_date: convertDateString(data.from_date),
			end_date: convertDateString(data.to_date),
			title: data.title,
			blocked_project_status: data.blocked_project_status?.id?.toLowerCase(),
			reason_type: data.reason_type,
			notes: data.notes || '',
		};
		await mutation.mutateAsync(formattedData);
	};

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
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name={item ? 'Edit Blocked Dates' : 'Block Dates in Calendar'} />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView contentContainerStyle={styles.xxlgap}>
						<FormField
							control={form.control}
							name="reason_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel style={{ paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.xxs }}>Reason</FormLabel>
									<FormControl>
										<View style={{ borderTopWidth: theme.borderWidth.slim, paddingHorizontal: theme.padding.base, flexDirection: 'row', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
											<Pressable onPress={() => field.onChange('project')} style={{ padding: theme.padding.base, flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
												{field.value === 'project' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
												<Text size="secondary" color="regular">
													Project
												</Text>
											</Pressable>
											<Pressable onPress={() => field.onChange('event')} style={{ padding: theme.padding.base, flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
												{field.value === 'event' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
												<Text size="secondary" color="regular">
													Event
												</Text>
											</Pressable>
										</View>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<View style={styles.datesContainer}>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem style={{ paddingHorizontal: theme.padding.base }}>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<TextInput placeholder="title" value={field.value} onChangeText={field.onChange} style={[styles.textinput, styles.disabledInput(false), styles.inputPadding, { borderColor: theme.colors.borderGray }]} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{form.watch('reason_type') === ReasonType.Project && (
								<FormField
									control={form.control}
									name="blocked_project_status"
									render={({ field }) => (
										<FormItem style={{ paddingHorizontal: theme.padding.base }}>
											<FormLabel>Project Status</FormLabel>
											<FormControl>
												<Select value={field.value} onChange={field.onChange} items={enumToArray(StudioProjectStatus)} placeholder="Select project status" itemsToShow={3} selectStyle={{ backgroundColor: theme.colors.backgroundDarkBlack }} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<View
								style={{
									gap: theme.gap.base,
									flexDirection: 'row',
									paddingHorizontal: theme.padding.base,
								}}>
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
							{item?.id ? 'Update' : 'Block'}
						</Button>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
};

export default BlockDates;

const stylesheet = createStyleSheet(theme => ({
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
	datesContainer: {
		gap: theme.gap.base,
	},
	errorText: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
	},
}));
