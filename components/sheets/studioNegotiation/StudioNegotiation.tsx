import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Pressable, ScrollView, Platform, SafeAreaView, Keyboard, ActivityIndicator } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Text, TextInput } from '@touchblack/ui';
import { Radio, RadioFilled } from '@touchblack/icons';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@touchblack/ui';

import FormSchema, { NegotiationFormValues } from './schema';
import { SheetType } from 'sheets';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import Asterisk from '@components/Asterisk';
import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { useSharedValue } from 'react-native-reanimated';
import { PriceListTable, ServiceDaysTable } from '@presenters/studio/components/PricingInputTable';
import useGetStudioFloorPricingByVideoTypeId from '@network/useGetStudioFloorPricingByVideoId';

interface IProps {
	route: any;
}

export default function StudioNegotiation({ route }: IProps) {
	const onSuccess = route.params?.onSuccess;
	const conversation_id = route.params?.conversation_id;
	const project_name = route.params?.project_name;
	const days = route.params?.days;
	const hours = route.params?.hours;
	const booking_id = route.params?.booking_id;
	const film_type = route.params?.film_type;
	const setup_days = route.params?.setup_days;
	const shoot_days = route.params?.shoot_days;
	const dismantle_days = route.params?.dismantle_days;
	const studio_floor_id = route.params?.party1_id;
	const video_type_mapping_id = route.params?.video_type_mapping_id;
	const { data: detailedPricing, isLoading } = useGetStudioFloorPricingByVideoTypeId(video_type_mapping_id);
	const detailedPricingData = detailedPricing?.data;
	const tnc = detailedPricing?.tnc_url;

	// Calculate default prices when data is available
	const defaultPrices = useMemo(() => detailedPricingData?.reduce((acc, it) => ({ ...acc, [it.name]: it.price }), {}), [detailedPricingData]);

	// Initialize prices with empty object
	const [prices, setPrices] = useState({});

	// Update prices when defaultPrices changes
	useEffect(() => {
		if (defaultPrices && Object.keys(defaultPrices).length > 0) {
			setPrices(defaultPrices);
		}
	}, [defaultPrices]);

	const total = useMemo(() => {
		if (!prices) return '0';
		return Object.values(prices).reduce((acc, curr) => {
			const numValue = Number(curr);
			return acc + (isNaN(numValue) ? 0 : numValue);
		}, 0);
	}, [prices]);

	const navigation = useNavigation();

	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState<string | null>(null);
	const SERVICE_DAYS_DATA = [
		{ service: 'Setup', days: setup_days },
		{ service: 'Shoot', days: shoot_days },
		{ service: 'Dismantle', days: dismantle_days },
	];
	const form = useForm<NegotiationFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			studio_floor_booking_id: booking_id,
			conversation_id,
			full_advance: false,
			advance_amount: '',
			gst_applicable: true,
			payment_terms: '',
			cancellation_charges: '',
			comments: '',
		},
	});

	const onSubmit = useCallback(
		async (data: NegotiationFormValues) => {
			try {
				const response = await server.post(CONSTANTS.endpoints.initiate_negotiation, {
					...data,
					advance_amount: data.full_advance ? +total : +parseFloat(data.advance_amount).toFixed(2),
					amount: +total,
					services: detailedPricingData?.reduce(
						(acc, it) => ({
							...acc,
							[it.name]: {
								price_shift: it.price,
								total: prices[it.name],
							},
						}),
						{},
					),
					setup_days: setup_days,
					shoot_days: shoot_days,
					dismantle_days: dismantle_days,
					total_days: days,
					payment_terms: Number(data.payment_terms),
					cancellation_charges: parseFloat(data.cancellation_charges),
					owner: 'producer_studio',
					terms_and_conditions_url: tnc,
				});
				if (response.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: {
								header: 'Great start!',
								text: response.data.message,
								onPress: () => {
									onSuccess?.call();
									navigation.goBack();
								},
							},
						},
					});
				} else {
					throw new Error(response.data?.message || 'Something went wrong. Please try again later.');
				}
			} catch (error) {
				setServerError(error.message);
				form.setError('root', { message: error.message });
			}
		},
		[form, onSuccess, prices, total, detailedPricingData, setup_days, shoot_days, dismantle_days, days, tnc],
	);

	const AdvanceRadioOption = useCallback(
		({ value, label }: { value: boolean; label: string }) => (
			<Pressable style={styles.radioWrapper} onPress={() => form.setValue('full_advance', value)}>
				<View style={styles.radioButtonContainer}>{form.watch('full_advance') === value ? <RadioFilled color={theme.colors.primary} size={'24'} /> : <Radio id="advance_payment" size={'24'} color={theme.colors.borderGray} />}</View>
				<Text size="bodyMid" color="muted" numberOfLines={1}>
					{label}
				</Text>
			</Pressable>
		),
		[form, theme.colors.primary, styles.radioButtonContainer, styles.radioWrapper, theme.colors.borderGray],
	);

	const GstRadioOption = useCallback(
		({ value, label }: { value: boolean; label: string }) => (
			<Pressable style={styles.radioWrapper} onPress={() => form.setValue('gst_applicable', value)}>
				<View style={styles.radioButtonContainer}>{form.watch('gst_applicable') === value ? <RadioFilled color={theme.colors.primary} size={'24'} /> : <Radio id="gst_applicable" size={'24'} color={theme.colors.borderGray} />}</View>
				<Text size="bodyMid" color="muted" numberOfLines={1}>
					{label}
				</Text>
			</Pressable>
		),
		[form, theme.colors.primary, styles.radioButtonContainer, styles.radioWrapper, theme.colors.borderGray],
	);

	const listEmptyComponent = useMemo(
		() => (
			<Text size="bodyMid" color="error">
				{serverError}
			</Text>
		),
		[serverError],
	);

	const keyboardHeight = useSharedValue(0);
	const [bottomMargin, setBottomMargin] = useState(0);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
			keyboardHeight.value = event.endCoordinates.height;
			setBottomMargin(event.endCoordinates.height - 2 * theme.padding.base);
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			keyboardHeight.value = 0; // Reset to 0 when keyboard is hidden
			setBottomMargin(0); // Reset state
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, [keyboardHeight, theme.padding.base]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name={`${project_name} Pricing`} />
			{isLoading ? (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
					<Text color="muted" size="bodyBig" style={{ marginTop: theme.margins.base }}>
						Loading pricing data...
					</Text>
				</View>
			) : (
				<>
					<ScrollView style={{ maxHeight: '80%', marginBottom: bottomMargin }}>
						<Text color="muted" size="bodyMid" style={styles.priceListText}>
							Shoot Type
						</Text>
						<Text color="regular" size="bodyBig" style={styles.priceListText1}>
							{film_type}
						</Text>
						<View style={styles.tableView}>
							<ServiceDaysTable data={SERVICE_DAYS_DATA} />
							<PriceListTable total={total} prices={prices} setPrices={setPrices} data={detailedPricingData} title="Price List" />
						</View>

						<Form {...form}>
							<View style={styles.body}>
								<FormField
									control={form.control}
									name="full_advance"
									render={() => (
										<FormItem style={{ gap: theme.gap.xxs }}>
											<FormLabel style={styles.formLabelWithPadding}>
												Need full payment in Advance? <Asterisk />
											</FormLabel>
											<FormControl
												style={{
													borderTopWidth: theme.borderWidth.slim,
													borderColor: theme.colors.borderGray,
													paddingHorizontal: theme.padding.base,
													borderBottomWidth: theme.borderWidth.slim,
												}}>
												<View style={styles.radioContainer}>
													<AdvanceRadioOption value={true} label="Yes" />
													<AdvanceRadioOption value={false} label="No" />
												</View>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{!form.watch('full_advance') && (
									<FormField
										control={form.control}
										name="advance_amount"
										render={({ field }) => (
											<FormItem style={styles.formItem}>
												<FormLabel style={styles.formLabel}>
													Advance Amount <Asterisk />
												</FormLabel>
												<FormControl>
													<TextInput
														editable={!form.watch('full_advance')}
														keyboardType="number-pad"
														onChangeText={field.onChange}
														placeholder="Rs. 00.00"
														value={field.value}
														placeholderTextColor={theme.colors.typographyLight}
														style={[
															styles.textinput,
															styles.inputPadding,
															{
																borderColor: form.formState.errors.advance_amount ? theme.colors.destructive : theme.colors.borderGray,
																paddingLeft: 2 * theme.padding.base,
															},
														]}
													/>
													<Text size="bodyBig" color="regular" style={{ position: 'absolute', top: Platform.OS === 'android' ? 22 : 16, left: 16 }}>
														₹
													</Text>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
								<FormField
									control={form.control}
									name="gst_applicable"
									render={() => (
										<FormItem style={{ gap: theme.gap.xxs }}>
											<FormLabel style={styles.formLabelWithPadding}>
												GST Applicable <Asterisk />
											</FormLabel>
											<FormControl
												style={{
													borderTopWidth: theme.borderWidth.slim,
													borderColor: theme.colors.borderGray,
													paddingHorizontal: theme.padding.base,
													borderBottomWidth: theme.borderWidth.slim,
												}}>
												<View style={styles.radioContainer}>
													<GstRadioOption value={true} label="Yes" />
													<GstRadioOption value={false} label="No" />
												</View>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="payment_terms"
									render={({ field }) => (
										<FormItem style={styles.formItem}>
											<FormLabel style={styles.formLabel}>Payment Terms (After invoice generation)</FormLabel>
											<FormControl>
												<TextInput
													keyboardType="decimal-pad"
													onChangeText={field.onChange}
													placeholder="Payment terms"
													value={field.value}
													placeholderTextColor={theme.colors.typographyLight}
													style={[
														styles.textinput,
														styles.inputPadding,
														{
															borderColor: form.formState.errors.payment_terms ? theme.colors.destructive : theme.colors.borderGray,
														},
													]}
												/>
												<Text size="bodyBig" style={{ position: 'absolute', top: Platform.OS === 'android' ? 22 : 16, right: 16 }} color="muted">
													days
												</Text>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="cancellation_charges"
									render={({ field }) => (
										<FormItem style={styles.formItem}>
											<FormLabel style={styles.formLabel}>Cancellation Charge (After confirmation)</FormLabel>
											<FormControl>
												<TextInput
													keyboardType="decimal-pad"
													onChangeText={field.onChange}
													placeholder="Cancellation charge"
													value={field.value}
													placeholderTextColor={theme.colors.typographyLight}
													style={[
														styles.textinput,
														styles.inputPadding,
														{
															borderColor: form.formState.errors.cancellation_charges ? theme.colors.destructive : theme.colors.borderGray,
															paddingLeft: 2 * theme.padding.base,
														},
													]}
												/>
												<Text size="bodyBig" color="regular" style={{ position: 'absolute', top: Platform.OS === 'android' ? 22 : 16, left: 16 }}>
													₹
												</Text>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="comments"
									render={({ field }) => (
										<FormItem style={[styles.formItem, { marginBottom: theme.margins.base }]}>
											<FormLabel style={styles.formLabel}>Notes (Optional)</FormLabel>
											<FormControl>
												<TextInput
													onChangeText={field.onChange}
													placeholder="Write a note for the producer..."
													value={field.value}
													placeholderTextColor={theme.colors.typographyLight}
													style={[
														styles.textinput,
														styles.inputPadding,
														styles.multilineTextInput,
														{
															borderColor: form.formState.errors.comments ? theme.colors.destructive : theme.colors.borderGray,
														},
													]}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{listEmptyComponent}
							</View>
						</Form>
					</ScrollView>
					<View style={styles.bottomView}>
						<View style={styles.totalPriceContainer}>
							<Text size="primarySm" style={styles.totalPriceText} color="muted">
								Total price is{' '}
							</Text>
							<Text size="primarySm" style={styles.totalPriceText} weight="bold" color="regular">
								₹ {Number(form.watch('gst_applicable') ? Number(total) * 1.18 : total).toFixed(2)}/-
							</Text>
							<Text size="primarySm" style={styles.totalPriceText} color="muted">
								{' '}
								(GST {form.watch('gst_applicable') ? 'Incl.' : 'Excl.'})
							</Text>
						</View>
						<View style={styles.footer}>
							<Button onPress={() => navigation.goBack()} type="secondary" textColor="regular" style={styles.widthHalf}>
								Cancel
							</Button>
							<Button onPress={form.handleSubmit(onSubmit, console.error)} type="primary" textColor="black" style={styles.widthHalf}>
								Send Estimates
							</Button>
						</View>
					</View>
				</>
			)}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	header: {
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
	tableView: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		marginTop: theme.margins.xs,
	},
	bottomView: {
		position: 'absolute',
		bottom: 0,
		paddingBottom: theme.padding.base,
	},
	priceListText: {
		paddingHorizontal: theme.padding.base,
	},
	priceListText1: {
		paddingHorizontal: theme.padding.base,
		paddingBottom: theme.padding.base,
		paddingTop: theme.padding.xxxs * 4,
	},
	tableHeading: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		minWidth: 95,
		maxWidth: 95,
		padding: theme.padding.base,
		color: theme.colors.success,
		fontWeight: theme.fontWeight.bold,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	totalAmountText: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		padding: theme.padding.base,
		borderColor: theme.colors.borderGray,
		alignSelf: 'flex-end',
	},
	tableContainer: {
		marginHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
		borderWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	topTableContainer: {
		marginHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
	},
	headerTitle: {
		lineHeight: theme.lineHeight.xl,
	},
	headerText: {
		lineHeight: theme.lineHeight.md,
	},
	body: {
		gap: theme.gap.base,
		marginVertical: theme.margins.base,
	},
	formItem: {
		paddingHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	formItemWithBorder: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	formLabel: {
		opacity: 0.8,
	},
	formLabelWithPadding: {
		paddingHorizontal: theme.padding.base,
		opacity: 0.8,
	},
	radioContainer: {
		flexDirection: 'row',
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		width: '100%',
	},
	radioWrapper: {
		flexDirection: 'row',
		flex: 1,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		paddingVertical: theme.padding.xs,
		gap: theme.gap.xxs,
	},
	radioButtonContainer: {
		paddingLeft: theme.padding.base,
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	widthHalf: {
		width: '50%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	totalPriceContainer: {
		flexDirection: 'row',
		width: '100%',
		backgroundColor: '#50483b',
		paddingVertical: theme.padding.xs,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	totalPriceText: {
		lineHeight: theme.lineHeight.custom,
	},
	labelContainer: {
		backgroundColor: 'red',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		paddingHorizontal: theme.padding.base,
	},
	iconButton: () => ({
		opacity: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}),
	multilineTextInput: {
		textAlignVertical: 'top',
	},
}));
