import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Pressable, ScrollView, SafeAreaView, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, FormLabel, Text } from '@touchblack/ui';
import { Radio, RadioFilled } from '@touchblack/icons';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@touchblack/ui';

import { SheetType } from 'sheets';
import server from '@utils/axios';

import FormFieldWrapper from '@components/FormFieldWrapper';
import Header from '@components/Header';
import FormSchema, { RaiseClaimFormValues } from './schema';
import useGetProjectDetails from '@network/useGetProjectDetails';
import useGetAllGsts from '@network/useGetAllGsts';
import useGetProjectDeal from '@network/useGetProjectDeal';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';
import Select from '@components/Select';
import Asterisk from '@components/Asterisk';

interface IProps {
	route: any;
}

export default function RaiseClaim({ route }: IProps) {
	const conversation_id = route.params?.conversation_id;
	const project_id = route.params?.project_id;
	const type = route.params?.type;
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isEditing] = useState(false);
	const screenHeaderText = isEditing ? 'Edit Claim' : 'Raise a Claim';
	const buttonText = isEditing ? 'Update and Claim' : 'Claim';
	const { userId } = useAuth();
	const navigation = useNavigation();

	const { data: projectDetails } = useGetProjectDetails(project_id);
	const { data: allGsts } = useGetAllGsts(type);
	const gsts = allGsts?.map(it => ({ name: it?.gstin, id: it?.id }));
	const { data: deal } = useGetProjectDeal(userId!, project_id, projectDetails?.producer_id);

	const amount = deal?.confirmed_price;
	const projectName = projectDetails?.project_name;
	const paymentTerms = deal?.payment_terms;
	const cancellationCharges = deal?.cancellation_charges;
	const comments = deal?.comments;
	const projectText = `Please check your pricing information of amount ${amount} for project ${projectName} below.`;

	const formFields = useMemo(
		() => [
			{ name: 'amount', label: 'Amount (Excl. GST)', disabled: false, placeholder: 'Rs. 00.00', keyboardType: 'decimal-pad' as const },
			{ name: 'payment_terms', label: 'Payment Terms (After invoice generation)', disabled: false, placeholder: 'Payment terms', keyboardType: 'decimal-pad' as const },
			{ name: 'cancellation_charges', label: 'Cancellation Charge (Only after confirmation)', disabled: false, placeholder: 'Cancellation charge', keyboardType: 'decimal-pad' as const },
			{ name: 'comments', label: 'Comment for revision (Optional)', disabled: false, placeholder: 'Write a note for the producer...', multiline: true, numberOfLines: 3 },
		],
		[],
	);

	const form = useForm<RaiseClaimFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			conversation_id: conversation_id,
			amount: amount,
			gst_applicable: true,
			gst: null,
			payment_terms: String(paymentTerms || ''),
			cancellation_charges: cancellationCharges,
			comments: comments,
		},
	});

	useEffect(() => {
		if (amount !== undefined && projectDetails && deal) {
			form.reset({
				conversation_id: conversation_id,
				amount: amount,
				gst_applicable: true,
				gst: null,
				payment_terms: String(paymentTerms),
				cancellation_charges: cancellationCharges,
				comments: comments,
			});
		}
	}, [amount, projectDetails, deal, form, conversation_id, paymentTerms, cancellationCharges, comments]);

	const onSubmit = useCallback(
		async (data: RaiseClaimFormValues) => {
			try {
				setServerError(null);
				const response = await server.post(CONSTANTS.endpoints.raise_claim, data);
				if (response.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: { header: 'Success', text: response.data.message, onPress: () => navigation.goBack() },
						},
					});
				} else {
					throw new Error(response.data?.message || 'Something went wrong. Please try again later.');
				}
			} catch (error) {
				const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
				setServerError(errorMessage);
				form.setError('root', { message: errorMessage });
			}
		},
		[form, navigation],
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
		[form, styles, theme.colors],
	);

	function calculateTotalAmount() {
		if (form.watch('gst_applicable')) {
			const total = (Number(amount) * 1.18).toFixed(2);
			return total;
		} else {
			return amount;
		}
	}

	/*const toggleEditing = () => {
		setIsEditing(!isEditing);
	};*/

	/*const EditClaim = () => {
		return (
			<Pressable onPress={toggleEditing}>
				<Pencil size="24" color={isEditing ? theme.colors.primary : theme.colors.typography} />
			</Pressable>
		);
	};*/

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<ScrollView style={styles.container}>
				<Header name={screenHeaderText} />
				<View style={styles.header}>
					<Text color="muted" size="primarySm" style={styles.headerText}>
						{projectText}
					</Text>
				</View>
				<Form {...form}>
					<View style={styles.body}>
						{formFields.slice(0, 1).map(field => (
							<FormFieldWrapper key={field.name} control={form.control} errors={form.formState.errors} {...field} />
						))}
						<FormField
							control={form.control}
							name="gst_applicable"
							render={() => (
								<FormItem style={styles.formItem}>
									<FormControl>
										<FormLabel>
											GST Applicable <Asterisk />
										</FormLabel>
										<View style={styles.radioContainer}>
											<RadioOption value={true} label="Yes" />
											<RadioOption value={false} label="No" />
										</View>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{form.watch('gst_applicable') === true && (
							<FormField
								control={form.control}
								name="gst"
								render={({ field }) => (
									<FormItem style={styles.formItem}>
										<FormControl>
											<Select placeholder="Select GST account" value={field.value} onChange={field.onChange} items={gsts} itemsToShow={Math.min(3, gsts?.length)} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{formFields.slice(1).map(field => (
							<FormFieldWrapper key={field.name} disabled={field.disabled} control={form.control} errors={form.formState.errors} {...field} />
						))}
						{form.formState.errors.root && (
							<Text size="bodyMid" color="error">
								{form.formState.errors.root.message}
							</Text>
						)}
						<View style={styles.disclaimer}>
							<Text size="bodyBig" style={styles.disclaimerText} color="muted">
								Payments will be held until GSTR-1 is filed.
							</Text>
							<Text size="bodyBig" style={styles.disclaimerText} color="muted">
								Talent Grid team will contact you for assistance with GSTR-1 filing.
							</Text>
							<Text size="bodyBig" style={styles.disclaimerText} color="muted">
								Update your PAN details to receive payments and update TDS credits.
							</Text>
						</View>
					</View>
				</Form>
				{serverError && (
					<View style={styles.errorContainer}>
						<Text size="bodyMid" color="error">
							{serverError}
						</Text>
					</View>
				)}
			</ScrollView>
			<View style={styles.footer}>
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
				<View style={styles.buttonContainer}>
					<Button onPress={form.handleSubmit(onSubmit)} style={styles.button} type="primary">
						{buttonText}
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		marginBottom: Platform.OS === 'ios' ? 100 : 120,
		backgroundColor: theme.colors.backgroundDarkBlack,
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
		gap: theme.gap.xxs,
	},
	formLabel: {
		opacity: 0.8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
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
	widthHalf: {
		width: '50%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		display: 'flex',
		width: '100%',
		position: 'absolute',
		bottom: 0,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	linkContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.gap.steps,
	},
	errorContainer: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
		padding: theme.padding.xs,
	},
	GSTINDetailsContainer: {
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		marginBottom: theme.margins.xxs,
	},
	GSTINtext: {
		flexGrow: 1,
	},
	disclaimer: {
		padding: theme.padding.base,
	},
	disclaimerText: {
		lineHeight: theme.lineHeight.md,
	},
	terms: {
		flexDirection: 'row',
		marginTop: theme.margins.xxs,
	},
	button: {
		flex: 1,
	},
}));
