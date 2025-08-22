import { SheetManager } from 'react-native-actions-sheet';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';
import { Button, Form, Text } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import Asterisk from '@components/Asterisk';
import FormFieldWrapper from '@components/FormFieldWrapper';
import Header from '@components/Header';
import { useAuth } from '@presenters/auth/AuthContext';
import FormSchema, { BankDetailsFormValues } from './schema';
import { SheetType } from 'sheets';
import { useBankDetails } from '@network/useBankDetails';
import { useGetBankIfsc } from '@network/useGetBankIfsc';
import IBankIfsc from '@models/dtos/IBankIfsc';
import CONSTANTS from '@constants/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function BankDetails() {
	const { styles, theme } = useStyles(stylesheet);
	const { userId, loginType, managerTalentId } = useAuth();
	const userID = loginType === 'manager' ? managerTalentId : userId;
	const [bankOptions, setBankOptions] = useState<IBankIfsc[]>([]);
	const [blackEnumId, setBlackEnumId] = useState<string>('');
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);

	const insets = useSafeAreaInsets();

	const { data: bankIfsc, isLoading: isBankIfscLoading } = useGetBankIfsc();
	const { data: existingBankDetail, isLoading, updateBankDetails, createBankDetails } = useBankDetails(userID!, blackEnumId);

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

	const form = useForm<BankDetailsFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			account_number: '',
			account_holder_name: '',
			account_type: { id: 0, name: 'Savings' },
			admin_bank_ifsc_id: { id: '', name: '' },
			black_enum_id: '',
		},
	});

	const onSubmitError = (error: any) => {
		form.setError('root', { message: error.message });
	};

	useEffect(() => {
		if (bankIfsc?.data?.results?.length > 0) {
			setBankOptions(
				bankIfsc.data.results.map((bank: any) => ({
					name: bank.name,
					id: bank.id,
				})),
			);

			const initialBlackEnumId = bankIfsc.data.results[0].admin_bank_id;
			setBlackEnumId(initialBlackEnumId);
			form.setValue('black_enum_id', initialBlackEnumId);
		}
	}, [bankIfsc, form]);

	const formFields = useMemo(
		() => [
			{
				name: 'account_holder_name',
				label: 'Account Name',
				placeholder: 'Please enter your account name',
			},
			{
				name: 'account_number',
				label: 'Account Number',
				placeholder: 'Please enter your bank account number',
			},
			{
				name: 'account_type',
				label: 'Account Type',
				placeholder: 'Please enter your bank account type',
				type: 'select' as const,
				items: [
					{ name: 'Savings', id: 0 },
					{ name: 'Current', id: 1 },
				],
			},
			{
				name: 'admin_bank_ifsc_id',
				label: 'IFSC Code',
				placeholder: 'Please enter your bank IFSC code',
				type: 'select' as const,
				items: bankOptions,
			},
		],
		[bankOptions],
	);

	useEffect(() => {
		if (existingBankDetail?.length > 0) {
			const bankDetail = existingBankDetail[0];
			form.reset({
				account_number: bankDetail.account_number,
				account_holder_name: bankDetail.account_holder_name,
				account_type: bankDetail.account_type === 'Savings' ? { id: 0, name: 'Savings' } : { id: 1, name: 'Current' },
				admin_bank_ifsc_id: {
					id: bankDetail.admin_bank_ifsc_id,
					name: bankDetail.bank_ifsc,
				},
				black_enum_id: bankDetail.black_enum_id,
			});
			setBlackEnumId(bankDetail.black_enum_id);
		}
	}, [existingBankDetail, form]);

	const onSubmit = async (data: BankDetailsFormValues) => {
		if (!userId) {
			form.setError('root', { message: 'User ID not found' });
			return;
		}

		try {
			const formData = {
				user_bank_detail: {
					account_number: data.account_number,
					account_holder_name: data.account_holder_name,
					account_type: data.account_type.id,
					admin_bank_ifsc_id: data.admin_bank_ifsc_id.id,
					black_enum_id: blackEnumId,
				},
			};

			if (existingBankDetail?.length > 0) {
				await updateBankDetails({
					userId: userID,
					bankId: existingBankDetail[0].id,
					data: formData,
				});
			} else {
				await createBankDetails({ userId: userID, data: formData });
			}

			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Success',
						text: 'Bank details saved successfully',
						onPress: null,
					},
				},
			});
		} catch (error) {
			form.setError('root', { message: 'Something went wrong' });
		}
	};

	if (isLoading || isBankIfscLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<Header name="Bank Details" />
				<Text size="bodyBig" color="muted">
					Loading...
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header onLayout={handleLayout} name="Bank Details" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView
						style={styles.formContainer}
						contentContainerStyle={{
							gap: theme.gap.xxl,
						}}>
						{formFields.map(field => (
							<FormFieldWrapper
								key={field.name}
								control={form.control}
								errors={form.formState.errors}
								value={form.watch(field.name)}
								{...field}
								label={
									<>
										{field.label}
										<Asterisk />
									</>
								}
							/>
						))}
						{form.formState.errors.root && (
							<Text size="bodyMid" style={styles.error} color="error">
								{form.formState.errors.root.message}
							</Text>
						)}
					</ScrollView>
				</Form>
				<View style={styles.footer}>
					<Button type="primary" style={styles.button} onPress={form.handleSubmit(onSubmit, onSubmitError)}>
						Submit
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default BankDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	formContainer: {
		flex: 1,
	},
	footer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
	error: {
		paddingHorizontal: theme.margins.base,
	},
}));
