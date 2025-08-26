import { View, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput } from '@touchblack/ui';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@touchblack/ui';

import FormSchema, { ReviseClaimFormValues } from './schema';
import { SheetType } from 'sheets';
import server from '@utils/axios';

import CONSTANTS from '@constants/constants';

interface IProps {
	onSuccess?: () => void;
	sender_name: string;
	amount: string | number;
	conversation_id: UniqueId;
	gst_applicable: boolean;
	payment_terms: string | number;
	cancellation_charges: string | number;
	negotiation_id: UniqueId;
	comments: string;
}

export default function StudioReviseClaim({ onSuccess, comments, cancellation_charges, payment_terms, gst_applicable, conversation_id, negotiation_id, sender_name, amount }: IProps) {
	const { styles, theme } = useStyles(stylesheet);

	const form = useForm<ReviseClaimFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			conversation_id: conversation_id || '',
			amount: String(amount || ''),
			gst_applicable: gst_applicable ?? true,
			payment_terms: String(payment_terms || ''),
			cancellation_charges: String(cancellation_charges || ''),
			comments: comments || '',
		},
	});

	const onSubmit = async (data: ReviseClaimFormValues) => {
		try {
			const response = await server.post(CONSTANTS.endpoints.studio_revise_claim(negotiation_id), data);
			if (response.data?.success) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Success,
						data: { header: 'Success', text: response.data.message, onPress: onSuccess },
					},
				});
			} else {
				throw new Error(response.data?.message || 'Something went wrong. Please try again later.');
			}
		} catch (error) {
			form.setError('root', { message: error.message });
		}
	};

	function calculateTotalAmount() {
		return (form.watch('amount') * 1.18).toFixed(2);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.previousOfferContainer}>
				<Text color="regular" size="bodySm">
					{sender_name} claimed ₹{amount}
				</Text>
			</View>
			<View style={styles.header}>
				<Text color="regular" size="primaryMid">
					Counter Pricing
				</Text>
			</View>
			<Form {...form}>
				<View style={styles.body}>
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem style={styles.formItem}>
								<FormLabel style={styles.formLabel}>Amount/hr. (GST Excl.)</FormLabel>
								<FormControl>
									<TextInput
										keyboardType="number-pad"
										onChangeText={field.onChange}
										placeholder="Rs. 00.00"
										value={field.value}
										placeholderTextColor={theme.colors.typographyLight}
										style={[
											styles.textinput,
											styles.inputPadding,
											{
												borderColor: form.formState.errors.amount ? theme.colors.destructive : theme.colors.borderGray,
											},
										]}
									/>
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
										editable={false}
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
								<FormLabel style={styles.formLabel}>Cancellation Charge</FormLabel>
								<FormControl>
									<TextInput
										editable={false}
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
											},
										]}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="comments"
						render={({ field }) => (
							<FormItem style={styles.formItem}>
								<FormLabel style={styles.formLabel}>Comments for revision (Optional)</FormLabel>
								<FormControl>
									<TextInput
										editable={false}
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
					{form.formState.errors.root && (
						<Text size="bodyMid" color="error">
							{form.formState.errors.root.message}
						</Text>
					)}
				</View>
			</Form>
			<View style={styles.totalPriceContainer}>
				<Text size="primarySm" color="muted">
					Your total price is{' '}
				</Text>
				<Text size="primarySm" weight="bold" color="regular">
					₹{calculateTotalAmount()}/-
				</Text>
				<Text size="primarySm" color="muted">
					(GST Incl.)
				</Text>
			</View>
			<View style={styles.footer}>
				<Button onPress={() => SheetManager.hide('Drawer', { payload: { sheet: SheetType.EditFilm } })} type="secondary" textColor="regular" style={styles.widthHalf}>
					Cancel
				</Button>
				<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
					Send
				</Button>
			</View>
		</ScrollView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		paddingBottom: theme.padding.base,
	},
	header: {
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
	},
	previousOfferContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingVertical: theme.padding.xxs,
		alignItems: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	body: {
		gap: theme.gap.base,
		marginVertical: theme.margins.base,
	},
	formItem: {
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	formLabel: {
		opacity: 0.8,
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
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	totalPriceContainer: {
		flexDirection: 'row',
		backgroundColor: '#50483b',
		paddingVertical: theme.padding.xxs,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	labelContainer: {
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
