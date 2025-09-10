import { useCallback, useMemo, useState } from 'react';
import { View, Pressable, ScrollView, Platform } from 'react-native';
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
import { useAuth } from '@presenters/auth/AuthContext';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

interface IProps {
	onSuccess?: () => void;
	conversation_id: UniqueId;
	project_name: string;
}

export default function Negotiation({ onSuccess, conversation_id, project_name }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const {authToken, loginType} = useAuth()
	const { selectedTalent } = useTalentContext();
	const selectedTalentId = selectedTalent?.talent?.user_id;
	
	const [serverError, setServerError] = useState<string | null>(null);

	const form = useForm<NegotiationFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			conversation_id,
			amount: '',
			gst_applicable: true,
			payment_terms: '',
			cancellation_charges: '',
			comments: '',
		},
	});

	const calculateTotalAmount = useCallback(() => {
		const amount = parseFloat(form.watch('amount') || '0');
		const gstApplicable = form.watch('gst_applicable');
		return gstApplicable ? (amount * 1.18).toFixed(2) : amount.toFixed(2);
	}, [form]);

	const onSubmit = useCallback(
		async (data: NegotiationFormValues) => {
			try {
				const queryParams = loginType === 'manager' ? `?talent_id=${selectedTalentId}` : '';
				const response = await server.post(`${CONSTANTS.endpoints.initiate_negotiation}${queryParams}`, {
					...data,
					amount: parseFloat(data.amount).toFixed(2),
					payment_terms: Number(data.payment_terms),
					cancellation_charges: parseFloat(data.cancellation_charges),
				});
				if (response.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: { header: 'Wohoo!', text: response.data.message, onPress: onSuccess },
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
		[form, onSuccess],
	);

	const RadioOption = useCallback(
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

	return (
		<ScrollView style={styles.container} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
			<View style={styles.header}>
				<Text color="regular" size="primaryMid" style={styles.headerTitle}>
					Pricing
				</Text>
				<Text color="muted" size="primarySm" style={styles.headerText}>
					Please add your pricing information for project {project_name} below.
				</Text>
			</View>
			<Form {...form}>
				<View style={styles.body}>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem style={styles.formItem}>
								<FormLabel style={styles.formLabel}>
									Amount (exclusive of GST) <Asterisk />
								</FormLabel>
								<FormControl>
									<TextInput
										keyboardType="number-pad"
										onChangeText={field.onChange}
										placeholder="Rs. 00.00"
										value={field.value.toString()}
										placeholderTextColor={theme.colors.typographyLight}
										style={[
											styles.textinput,
											styles.inputPadding,
											{
												borderColor: form.formState.errors.amount ? theme.colors.destructive : theme.colors.borderGray,
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
						name="gst_applicable"
						render={() => (
							<FormItem style={styles.formItem}>
								<FormLabel style={styles.formLabel}>
									GST Applicable <Asterisk />
								</FormLabel>
								<FormControl>
									<View style={styles.radioContainer}>
										<RadioOption value={true} label="Yes" />
										<RadioOption value={false} label="No" />
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
										value={field.value?.toString() ?? ''}
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
										value={field.value?.toString() ?? ''}
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
							<FormItem style={[styles.formItem, {  }]}>
								<FormLabel style={styles.formLabel}>Notes (Optional)</FormLabel>
								<FormControl>
									<TextInput
										onChangeText={field.onChange}
										placeholder="Write a note for the producer..."
										value={field.value?.toString() || ''}
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
			<View style={styles.totalPriceContainer}>
				<Text size="primarySm" style={styles.totalPriceText} color="muted">
					Your total price is{' '}
				</Text>
				<Text size="primarySm" style={styles.totalPriceText} weight="bold" color="regular">
					₹{calculateTotalAmount()}/-
				</Text>
				<Text size="primarySm" style={styles.totalPriceText} color="muted">
					(GST {form.watch('gst_applicable') ? 'Incl.' : 'Excl.'})
				</Text>
			</View>
			<View style={styles.footer}>
				<Button onPress={() => SheetManager.hide('Drawer', { payload: { sheet: SheetType.EditFilm } })} type="secondary" textColor="regular" style={styles.widthHalf}>
					Cancel
				</Button>
				<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
					Send Estimates
				</Button>
			</View>
		</ScrollView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		paddingTop: theme.padding.base,
	},
	header: {
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
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
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxxs,
	},
	formLabel: {
		opacity: 0.8,
	},
	radioContainer: {
		flexDirection: 'row',
		width: '100%',
	},
	radioWrapper: {
		flexDirection: 'row',
		flex: 1,
		borderWidth: theme.borderWidth.slim,
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
		position: 'absolute',
		bottom: 0,
	},
	totalPriceContainer: {
		marginBottom: 78,
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
