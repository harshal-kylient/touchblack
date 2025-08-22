import { Keyboard, SafeAreaView, ScrollView, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Button, Form, Text } from '@touchblack/ui';
import Asterisk from '@components/Asterisk';
import FormFieldWrapper from '@components/FormFieldWrapper';
import Header from '@components/Header';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import FormSchema, { PanCardFormValues } from './schema';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import { useEffect, useState } from 'react';
import { SheetType } from 'sheets';
import { usePanCardDetails } from '@network/usePanCardDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PanCardDetails() {
	const { styles, theme } = useStyles(stylesheet);
	const { userId, loginType, managerTalentId } = useAuth();
	const userID = loginType === 'manager' ? managerTalentId : userId;
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);

	const insets = useSafeAreaInsets();

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

	const form = useForm<PanCardFormValues>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			proof_type: CONSTANTS.PROOF_TYPE.PAN_CARD,
			proof_number: '',
			name: '',
		},
	});

	const { data, isLoading, updatePanCardDetails, createPanCardDetails, isUpdating, isCreating } = usePanCardDetails(userID ?? '', CONSTANTS.PROOF_TYPE.PAN_CARD);

	// Update form when data is loaded
	useEffect(() => {
		if (data) {
			form.reset({
				proof_type: CONSTANTS.PROOF_TYPE.PAN_CARD,
				proof_number: data.proof_number,
				name: data.user_name || '',
			});
		}
	}, [data, form]);

	const onSubmit = async (formData: PanCardFormValues) => {
		try {
			if (data?.id) {
				await updatePanCardDetails({
					userId: userID ?? '',
					proofId: data.id,
					data: formData,
				});
			} else {
				await createPanCardDetails({
					userId: userID ?? '',
					data: formData,
				});
			}

			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Success',
						text: `PAN Card details ${data?.id ? 'updated' : 'saved'} successfully`,
						onPress: null,
					},
				},
			});
		} catch (error) {
			form.setError('root', {
				message: error instanceof Error ? error.message : 'An error occurred',
			});
		}
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<Header name="PAN Card Details" />
				<TextPlaceholder customWidth={100} />
				<TextPlaceholder customWidth={'100%'} customHeight={50} />
				<TextPlaceholder customWidth={100} />
				<TextPlaceholder customWidth={'100%'} customHeight={50} />
			</SafeAreaView>
		);
	}

	const isSubmitting = isUpdating || isCreating;

	return (
		<SafeAreaView style={styles.container}>
			<Header onLayout={handleLayout} name="PAN Card Details" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView
						style={styles.formContainer}
						contentContainerStyle={{
							gap: theme.gap.xxl,
						}}>
						<FormFieldWrapper
							name="proof_number"
							label={
								<>
									PAN Number
									<Asterisk />
								</>
							}
							control={form.control}
							placeholder="Please enter your PAN Number"
							errors={form.formState.errors}
							disabled={isSubmitting}
						/>
						<FormFieldWrapper name="name" label={<>Full Name</>} control={form.control} placeholder="Please enter your full name as per PAN card" errors={form.formState.errors} disabled={isSubmitting} />
						{form.formState.errors.root && (
							<View style={styles.errorContainer}>
								<Text size="bodyMid" color="error">
									{form.formState.errors.root.message}
								</Text>
							</View>
						)}
					</ScrollView>
				</Form>
				<View style={styles.footer}>
					<Button type="primary" style={styles.button} onPress={form.handleSubmit(onSubmit)} disabled={isSubmitting} loading={isSubmitting}>
						{data?.id ? 'Update' : 'Submit'}
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default PanCardDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	formContainer: {
		flex: 1,
	},
	errorContainer: {
		margin: theme.margins.base,
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
}));
