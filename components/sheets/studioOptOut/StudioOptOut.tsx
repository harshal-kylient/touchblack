import { View, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useForm } from 'react-hook-form';

import { Button, Text } from '@touchblack/ui';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@touchblack/ui';
import { Radio, RadioFilled } from '@touchblack/icons';
import { zodResolver } from '@hookform/resolvers/zod';

import FormSchema, { OptOutFormValues } from './schema';
import { SheetType } from 'sheets';
import server from '@utils/axios';

import { memo, useCallback } from 'react';
import FormFieldWrapper from '@components/FormFieldWrapper';
import CONSTANTS from '@constants/constants';
import { useNavigation } from '@react-navigation/native';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';

const RADIO_OPTIONS = [
	{ value: 'other_commitments', label: 'Other commitments.' },
	{ value: 'personal_reason', label: 'Personal Reason.' },
	{ value: 'other', label: 'Other' },
] as const;

interface IProps {
	onSuccess?: () => void;
	booking_id: UniqueId;
	conversation_id: UniqueId;
}

const StudioOptOut = memo(({ onSuccess, booking_id, conversation_id }: IProps) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	const form = useForm<OptOutFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			studio_floor_booking_id: booking_id,
			conversation_id: conversation_id,
			reason: 'personal_reason',
			customReason: '',
		},
	});

	const handleCancel = useCallback(() => {
		SheetManager.hide('Drawer');
	}, []);

	const onSubmit = useCallback(
		async (data: OptOutFormValues) => {
			try {
				const reasonValue = form.watch('reason') === RADIO_OPTIONS.find(it => it.value === 'other')?.value ? data.customReason : RADIO_OPTIONS.find(it => it.value === data.reason)?.label;
				const response = await server.patch(CONSTANTS.endpoints.studio_optout, {
					status: EnumStudioStatus['Not available'],
					...data,
					reason: reasonValue,
					customReason: undefined,
				});
				if (response.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: {
								header: 'Success',
								text: response.data.message,
								onPress: () => {
									if (onSuccess) {
										onSuccess();
									}
									/* TODO: INVALIDATE useGetTalentProjects */
									navigation.goBack();
								},
							},
						},
					});
				} else {
					throw new Error(response.data?.message || 'Something went wrong. Please try again later.');
				}
			} catch (error) {
				form.setError('root', { message: error.message });
			}
		},
		[form, onSuccess, booking_id, navigation],
	);

	const RadioOption = useCallback(
		({ value, label }: { value: OptOutFormValues['reason']; label: string }) => (
			<Pressable style={styles.radioWrapper} onPress={() => form.setValue('reason', value)}>
				<View style={styles.radioButtonContainer}>{form.watch('reason') === value ? <RadioFilled color={theme.colors.primary} size={'24'} /> : <Radio id="reason" size={'24'} color={theme.colors.borderGray} />}</View>
				<Text size="bodyMid" color="muted" numberOfLines={1}>
					{label}
				</Text>
			</Pressable>
		),
		[form, styles, theme],
	);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Text color="regular" size="primaryMid" style={styles.headerTitle}>
					I am Not Available because :
				</Text>
			</View>
			<Form {...form}>
				<View style={styles.body}>
					<FormField
						control={form.control}
						name="reason"
						render={() => (
							<FormItem style={styles.formItem}>
								<FormControl>
									<View style={styles.radioContainer}>
										{RADIO_OPTIONS.map(option => (
											<RadioOption key={option.value} value={option.value} label={option.label} />
										))}
									</View>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{form.watch('reason') === RADIO_OPTIONS.find(it => it.value === 'other')?.value && <FormFieldWrapper control={form.control} name="customReason" label="Custom Reason" placeholder="Write reason to opted out..." multiline={true} numberOfLines={4} errors={form.formState.errors} />}
					{form.formState.errors.root && (
						<Text size="bodyMid" color="error" style={styles.error}>
							{form.formState.errors.root.message}
						</Text>
					)}
				</View>
			</Form>
			<View style={styles.footer}>
				<Button onPress={handleCancel} type="secondary" textColor="regular" style={styles.widthHalf}>
					Cancel
				</Button>
				<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
					Send
				</Button>
			</View>
		</ScrollView>
	);
});

const stylesheet = createStyleSheet(theme => ({
	container: {
		paddingVertical: theme.padding.base,
	},
	header: {
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
		marginBottom: theme.margins.base,
	},
	headerTitle: {
		lineHeight: theme.lineHeight.xl,
	},
	body: {
		gap: theme.gap.base,
		marginVertical: theme.margins.base,
	},
	formItem: {
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
	radioContainer: {
		gap: theme.gap.base,
	},
	radioWrapper: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	radioButtonContainer: {},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	error: {
		paddingHorizontal: theme.padding.base,
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
}));

export default StudioOptOut;
