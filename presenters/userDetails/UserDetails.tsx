import { memo, useState, useEffect } from 'react';
import { SafeAreaView, View, Alert, ActivityIndicator, TouchableOpacity, Pressable, Linking } from 'react-native';
import { useForm } from 'react-hook-form';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FormSchema from './schema';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text, Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, TextInput } from '@touchblack/ui';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import useGetStates from '@network/useGetStates';
import Header from '@components/Header';
import Select from '@components/Select';
import { AddCircled, Pencil } from '@touchblack/icons';
import useGSTList from '@network/useGSTList';
import { useAuth } from '@presenters/auth/AuthContext';
import { useSubscriptionInitiate } from '@network/useSubscriptionInitiate';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import capitalized from '@utils/capitalized';
import { useGetSubscriptionCurrentStatus } from '@network/useGetSubscriptionCurrentStatus';
import Switch from '@components/Switch';
import ListSelect from '@components/ListSelect';
import CONSTANTS from '@constants/constants';
import { getReporterId } from '@utils/reporterId';

type UserDetailsNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

const UserDetails = memo(function GSTDetails({ route }) {
	const subscriptionPlanId = route?.params?.planId;
	const [auto_pay, setAutoPay] = useState('');
	const { userId, producerId, loginType, authToken } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const reporterId = getReporterId(loginType, producerId, userId);
	const { data: talentData } = useGetUserDetailsById(userType, reporterId);
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<UserDetailsNavigationProp>();
	const { data, isLoading: statesLoading, isError: statesError, error: statesErrorData } = useGetStates();
	const { mutate: initiateSubscription, error } = useSubscriptionInitiate();
	const [formSubmitting, setFormSubmitting] = useState(false);
	const { data: gstData, isLoading: gstLoading } = useGSTList();

	const transformGstData = gstData => {
		if (!gstData?.data || !Array.isArray(gstData.data)) return [];

		return gstData.data.map(item => ({
			id: item.id,
			name: item.gstin,
			stateId: item.state_id,
		}));
	};
	const formattedGstData = transformGstData(gstData);
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			state_id: { id: '', name: '' },
			email: '',
			gstin: null,
			gst_state_id: '',
		},
	});

	const handleSubscribe = () => {
		const state_Id = form.getValues('state_id');
		const gst_Id = form.getValues('gstin');
		const gst_state_id = form.getValues('gst_state_id');
		const subsId = subscriptionPlanId;
		const stateId = gst_state_id ? gst_state_id : state_Id?.id;
		const gstId = gst_Id;
		const autoPay = 'enabled';
		initiateSubscription(
			{ subsId, stateId, autoPay, gstId },
			{
				onSuccess: data => {
					const sessionId = data?.data?.provider_data?.subscription_session_id;
					const subscriptionID = data?.data?.subscription_id;
					if (autoPay === 'enabled') {
						handleSubscriptionRedirect(sessionId);
					} else {
						handlePaymentRedirect(subscriptionID);
					}
				},
				onError: error => {
					console.error('Error initiating subscription:', error);
				},
			},
		);
	};

	const handleSelectChange = (value: any) => {
		form.setValue('state_id', value);
	};
	const handleGstChange = (value: any) => {
		form.setValue('gst_state_id', value.stateId);
		form.setValue('gstin', value);
	};
	const handleAddGst = () => {
		navigation.navigate('GSTList');
	};
	const handleAddEmail = () => {
		navigation.navigate('AddYourEmail');
	};
	const handleAutoPayToggle = (value: boolean) => {
		const status = value ? 'enabled' : 'disabled';
		setAutoPay(status);
	};
	const handleSubscriptionRedirect = async (session_id: string) => {
		let url = `${CONSTANTS.WEB_URL}/subscriptionPayment?session_id=${session_id}&token=${authToken}`;
		try {
			await Linking.openURL(url);
		} catch (error) {
			console.log(error);
		}
	};

	const handlePaymentRedirect = async (subsId: string) => {
		let url = `${CONSTANTS.WEB_URL}/oneTimePayment?subscription_id=${subsId}&token=${authToken}`;
		try {
			await Linking.openURL(url);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (statesError) {
			Alert.alert('Error', `Failed to load states. ${statesErrorData?.message || 'Please try again later.'}`);
		}
	}, [statesError, statesErrorData]);

	if (statesLoading) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundDarkBlack }]}>
				<Header name="Billing Details" />
				<ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingStyle} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Billing Details" />

			<Form {...form}>
				<View style={styles.formContainer}>
					<View style={styles.formFields}>
						<FormField
							name="email"
							render={({ field }) => {
								useEffect(() => {
									if (talentData?.email) {
										form.setValue('email', talentData.email);
									}
								}, [talentData?.email]);
								return (
									<FormItem>
										<FormLabel style={styles.formLabel}>Email Id</FormLabel>
										<FormControl>
											{talentData?.email ? (
												<View style={styles.inputContainer}>
													<TextInput keyboardType="email-address" placeholder="Enter your email" value={field.value} onChangeText={field.onChange} style={styles.textInput} />
													<View style={styles.iconContainer}>
														<Pressable onPress={() => handleAddEmail()}>
															<Pencil color={theme.colors.primary} size="22" />
														</Pressable>
													</View>
												</View>
											) : (
												<View>
													<Pressable onPress={() => handleAddEmail()}>
														<View style={styles.emailButtonContainer}>
															<AddCircled color={theme.colors.borderGray} size="18" />
															<Text size="cardSubHeading" style={styles.addGstText} color="muted">
																{' '}
																Please add your email
															</Text>
														</View>
													</Pressable>
												</View>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							name="state_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel style={styles.formLabel}>State</FormLabel>
									<FormControl>{data && !statesError ? <ListSelect style={styles.formState} placeholder="Please select your state" items={data} onChange={handleSelectChange} value={field.value} itemsToShow={10} /> : <ActivityIndicator size="small" color={theme.colors.primary} />}</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="gstin"
							render={({ field }) => (
								<FormItem>
									<FormLabel style={styles.formLabel}>GSTIN (Optional)</FormLabel>
									<FormControl>
										<FormControl>{formattedGstData && !gstLoading ? <Select style={styles.formState} items={formattedGstData} placeholder="Please select your GSTIN" onChange={handleGstChange} value={field.value} /> : <ActivityIndicator size="small" color={theme.colors.primary} />}</FormControl>
									</FormControl>
								</FormItem>
							)}
						/>
						<Pressable onPress={() => handleAddGst()}>
							<View style={styles.gstButtonContainer}>
								<AddCircled color={theme.colors.borderGray} size="18" />
								<Text size="cardSubHeading" style={styles.addGstText} color="muted">
									{' '}
									Add your GSTIN
								</Text>
							</View>
						</Pressable>

						<Text color="muted" size="bodySm">
							Note: Enabling Auto-Pay will automatically deduct your subscription amount every month on the renewal date using your saved payment method. You can disable Auto-Pay anytime from your settings to stop future automatic payments.
						</Text>
					</View>
					<View style={styles.footerContainer}>
						<Button onPress={form.handleSubmit(handleSubscribe)} style={styles.proceedButton} type="primary">
							Proceed
						</Button>
					</View>
				</View>
			</Form>

			{formSubmitting && <ActivityIndicator size="large" color={theme.colors.primary} style={{ position: 'absolute', left: '50%', top: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] }} />}
		</SafeAreaView>
	);
});

export default UserDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	textInput: {
		flex: 1,
	},
	loadingStyle: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	iconContainer: {
		paddingHorizontal: theme.padding.base,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	button: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItem: {
		paddingHorizontal: theme.padding.xxs + 2,
		paddingVertical: theme.padding.base,
	},
	addGstText: {
		textAlign: 'center',
		paddingLeft: theme.padding.xxs,
	},
	textContainer: {},

	AutoContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: theme.margins.sm,
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.sm,
	},
	switchContainer: {
		transform: [{ scale: 0.7 }],
		borderColor: '#FFFFFF',
		borderWidth: theme.borderWidth.bold,
		borderRadius: 20,
		width: 'auto',
		margin: theme.margins.base,
	},
	gstButtonContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		marginTop: -theme.margins.xs * 2,
		backgroundColor: theme.colors.backgroundLightBlack,
		flexDirection: 'row',
		paddingHorizontal: theme.padding.xxs,
		paddingVertical: theme.padding.xxs,
		alignItems: 'center',
	},
	emailButtonContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundLightBlack,
		flexDirection: 'row',
		paddingHorizontal: theme.padding.xxs,
		paddingVertical: theme.padding.sm,
		alignItems: 'center',
	},
	formContainer: {
		flex: 1,
		paddingHorizontal: theme.padding.sm,
		justifyContent: 'space-between',
	},
	formFields: {
		gap: theme.gap.lg,
	},
	formLabel: {
		marginBottom: theme.padding.xxs,
	},
	formState: {
		bottom: 4,
	},
	inputField: {
		paddingHorizontal: theme.padding.xs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footerContainer: {
		flexDirection: 'row',
		bottom: 0,
		zIndex: 999999,
		right: 0,
		left: 0,
		width: '100%',
		paddingBottom: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingTop: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	proceedButton: {
		borderWidth: 1,
		marginBottom: theme.margins.base,
		flex: 1,
	},
	body: {
		gap: theme.gap.xxl,
		marginVertical: theme.margins.base,
	},
	error: {
		paddingHorizontal: theme.margins.base,
	},
	footer: {
		display: 'flex',
		borderTopWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
	},
	formItem: {
		marginHorizontal: theme.margins.base,
		gap: theme.gap.xxs,
	},
}));
