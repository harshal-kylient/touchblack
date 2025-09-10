import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FormSchema1 } from './schema';
import StudioStepsIndicator from './StepsIndicator';
import { z } from 'zod';
import Calendar from './Calendar';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useStudioBookingContext } from './StudioContext';
import useGetDistricts from '@network/useGetDistricts';
import { useAnimatedKeyboard } from 'react-native-reanimated';
import moment from 'moment';
import CONSTANTS from '@constants/constants';
import useGetProducerProjects from '@network/useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import Asterisk from '@components/Asterisk';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AutoComplete from '@components/AutoComplete';
import ListSelect from '@components/ListSelect';
import { Close } from '@touchblack/icons';

export default function StudioBookingStep1({ route }) {
	const direct_studio_booking = route.params?.direct_studio_booking;
	const studio_selected_flow = route.params?.studio_selected_flow;
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useStudioBookingContext();
	const [dates, setDates] = useState(state.dates);
	const [query, setQuery] = useState('');
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const [message, setMessage] = useState('');

	const insets = useSafeAreaInsets();

	const { data } = useGetDistricts(query?.toLowerCase());
	const { data: projectResponse, fetchNextPage: fetchNextProjectsPage } = useGetProducerProjects(EnumProducerStatus.Live, true);
	const projects = projectResponse?.map(it => ({ id: it?.id, name: it?.project_name, ...it }));

	const cityInputRef = useRef();
	const districts = data?.pages?.flatMap(page => page?.results) || [];
	const navigation = useNavigation();

	const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
	const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);

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

	const form = useForm<z.infer<typeof FormSchema1>>({
		resolver: zodResolver(FormSchema1),
		defaultValues: {
			city: state.city,
			dates: state.dates,
			set_up: state.set_up,
			shoot: state.shoot,
			dismantle: state.dismantle,
		},
	});

	function onSubmit(data: z.infer<typeof FormSchema1>) {
		dispatch({ type: 'CITY_FILTER', value: data.city });
		dispatch({ type: 'DATES', value: dates });
		dispatch({ type: 'SET_UP', value: data.set_up });
		dispatch({ type: 'SHOOT', value: data.shoot });
		dispatch({ type: 'DISMANTLE', value: data.dismantle });
		navigation.navigate('StudioBookingStep2');
	}

	function handleDateChange(value, callback) {
		callback(value);
		setDates(value);
	}

	const toggleFromDatePicker = () => {
		setIsFromDatePickerOpen(!isFromDatePickerOpen);
	};

	function getFormattedTime(date: Date | null | undefined) {
		if (!date) {
			return undefined;
		}

		const formattedTime = moment(date).format('hh:mm A');
		return formattedTime !== 'Invalid date' ? formattedTime : undefined;
	}

	function handleCity(item, callback) {
		callback(item);
		setQuery('');
	}

	const toggleToDatePicker = () => {
		setIsToDatePickerOpen(!isToDatePickerOpen);
	};

	const keyboard = useAnimatedKeyboard();

	const setProjectId = project => {
		dispatch({ type: 'PROJECT_ID', value: project });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Add Booking Details" />
			<StudioStepsIndicator step={0} />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						bounces={false}
						contentContainerStyle={{
							justifyContent: 'space-between',
							gap: theme.gap.xxl,
							paddingBottom: 86,
							backgroundColor: theme.colors.backgroundDarkBlack,
						}}>
						{direct_studio_booking && (
							<View style={{ gap: theme.gap.xs }}>
								<FormLabel style={{ paddingTop: theme.padding.base, paddingHorizontal: theme.padding.base }}>
									Project <Asterisk />
								</FormLabel>
								<ListSelect onEndReached={fetchNextProjectsPage} style={{ paddingHorizontal: theme.padding.base }} items={projects} itemsToShow={4} placeholder="Select Project" onChange={setProjectId} value={state.project_id} />
							</View>
						)}
						{!studio_selected_flow && (
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem>
										<FormLabel style={{ paddingHorizontal: theme.padding.base, paddingTop: direct_studio_booking ? 0 : theme.padding.base, paddingBottom: theme.padding.xs }}>City</FormLabel>
										<FormControl>
											<View style={styles.searchInputContainer}>
												<AutoComplete
													items={districts}
													itemsToShow={3}
													onSearch={setQuery}
													onChange={item => {
														field.onChange({ id: item?.id, name: item?.name });
														setQuery('');
													}}
													value={field.value}
													placeholder="Search district"
												/>
											</View>
										</FormControl>
										{query && Keyboard.isVisible() ? null : <FormMessage />}
									</FormItem>
								)}
							/>
						)}
						<FormField
							control={form.control}
							name="dates"
							render={({ field }) => (
								<FormItem style={{ marginTop: theme.margins.base, paddingHorizontal: theme.padding.base }}>
									<FormControl>
										<Calendar onChange={value => handleDateChange(value, field.onChange)} value={dates} onDismiss={() => {}} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<View style={styles.daysCountContainer}>
							<Text size="bodyBig" color="regular" style={styles.numberOfDaysText}>
								No. of Days
							</Text>
							<View style={[styles.studioBookingContainer, { borderTopWidth: theme.borderWidth.slim }]}>
								<Text size="inputLabel" color="muted" style={styles.daysTextContainer}>
									Setup
								</Text>
								<FormField
									control={form.control}
									name="set_up"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<TextInput style={styles.textinputDays} placeholder="Enter No. of Days" placeholderTextColor={theme.colors.muted} value={field.value} onChangeText={field.onChange} inputMode="numeric" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</View>
							<View style={styles.studioBookingContainer}>
								<Text size="inputLabel" color="muted" style={styles.daysTextContainer}>
									Shoot
								</Text>
								<FormField
									control={form.control}
									name="shoot"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<TextInput style={styles.textinputDays} placeholder="Enter No. of Days" placeholderTextColor={theme.colors.muted} value={field.value} onChangeText={field.onChange} inputMode="numeric" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</View>
							<View style={styles.studioBookingContainer}>
								<Text size="inputLabel" color="muted" style={styles.daysTextContainer}>
									Dismantle
								</Text>
								<FormField
									control={form.control}
									name="dismantle"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<TextInput style={styles.textinputDays} placeholder="Enter No. of Days" placeholderTextColor={theme.colors.muted} value={field.value} onChangeText={field.onChange} inputMode="numeric" />
											</FormControl>
										</FormItem>
									)}
								/>
							</View>
						</View>
						<Text size="bodyBig" color="muted" style={styles.noteText}>
							Based on your selected city, and dates the next screen will display available studios that match your requirements. Each studio listing will show the shift duration they operate (e.g., 4, 8, or 12 hours per shift) along with their rate per shift. Please review and select the studio that best fits your needs.
						</Text>
					</ScrollView>
					<View style={styles.confirmButton}>
						{message ? (
							<Pressable onPress={() => setMessage('')} style={{ paddingHorizontal: theme.padding.xs, flexDirection: 'row', gap: theme.gap.xs, justifyContent: 'center', alignItems: 'center', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xxs }}>
								<View style={{ justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: theme.colors.destructive }}>
									<Close size="20" color={'#000'} />
								</View>
								<Text color="error" size="bodyBig">
									{message}
								</Text>
							</Pressable>
						) : null}
						<Pressable style={{ marginTop: theme.margins.base, marginHorizontal: theme.margins.base, paddingVertical: theme.padding.base, flex: 1, backgroundColor: direct_studio_booking && !state.project_id?.id ? theme.colors.muted : theme.colors.primary }} disabled={direct_studio_booking ? !Boolean(state.project_id?.id) : false} onPress={form.handleSubmit(onSubmit, e => setMessage(e.error?.message || ''))}>
							<Text size="button" textAlign="center" color="black">
								Confirm
							</Text>
						</Pressable>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textInput: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		minHeight: 55,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	confirmButton: { backgroundColor: theme.colors.backgroundDarkBlack, paddingBottom: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, position: 'absolute', bottom: 0, minWidth: '100%' },
	noteText: { paddingHorizontal: theme.padding.base, lineHeight: 22, paddingBottom: theme.padding.base },
	numberOfDaysText: {
		paddingVertical: theme.padding.base,
	},
	disabledInput: (disabled: boolean) => ({
		backgroundColor: disabled ? '#292929' : theme.colors.black,
	}),
	textinputDays: {
		minWidth: '70%',
		borderTopWidth: 0,
		borderBottomWidth: 0,
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
	widthHalf: { width: '50%' },
	footer: {
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: theme.margins.base,
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
		paddingHorizontal: theme.padding.base,
	},
	errorText: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
	},

	searchResultsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
		width: '100%',
		maxHeight: 235,
	},
	searchInput: {
		borderWidth: 0,
		paddingHorizontal: theme.padding.xxs,
		flex: 1,
		marginBottom: 0,
	},
	searchResultItem: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	modalContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	modalContent: {
		alignItems: 'center',
	},
	closeButton: {
		alignSelf: 'flex-end',
		marginBottom: 10,
	},
	closeButtonText: {
		color: 'red',
		fontSize: 18,
	},
	container: {
		zIndex: 1,
		paddingHorizontal: theme.padding.base,
	},
	daysCountContainer: {
		zIndex: 1,
		paddingHorizontal: theme.padding.base,
		paddingBottom: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	studioBookingContainer: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	daysTextContainer: {
		alignSelf: 'center',
		minWidth: '30%',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		color: theme.colors.typography,

		fontFamily: 'CabinetGrotesk-Regular',
	},
	searchContainer: {
		flexDirection: 'row',
		flex: 1,
		zIndex: 9,
		minHeight: 54,
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		paddingHorizontal: theme.padding.base,
	},
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 999,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingLeft: 10,
		flex: 1,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	searchContainerWithResults: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.xxl,
		flex: 1,
	},
	textTag: {
		paddingLeft: theme.padding.xxs,
	},
	text: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		paddingTop: theme.padding.xxxxl,
	},
	inputContainer: {
		marginTop: theme.margins.base,
	},
	tabBg: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	searchInputContainer: {
		justifyContent: 'center',
		zIndex: 9,
		marginHorizontal: theme.margins.base,
	},
	searchIcon: {
		zIndex: 99,
		width: 56,
	},
	dropdownItems: {
		zIndex: 999999,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItem: {
		borderBottomWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.xxs,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xl,
	},
}));
