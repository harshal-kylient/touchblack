import { useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View, Text, StatusBar, SafeAreaView, Pressable, KeyboardAvoidingView, Alert, AppState, AppStateStatus } from 'react-native';
import { useForm } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, FormMessage } from '@touchblack/ui';
import { Pencil } from '@touchblack/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from './AuthContext';
import { getUniqueDeviceId } from '@utils/getDeviceInfo';
import FormSchema from './schema';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import OTPInput from '@components/OTPInput';
import createArray from '@utils/createArray';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Auth({ route, navigation }: any) {
	const user_identifier = route.params?.user_identifier;
	const unique_device_id = route.params?.unique_device_id;
	const [timer, setTimer] = useState(60);
	const [serverError, setServerError] = useState('');
	const { setAuthInfo } = useAuth();
	const insets = useSafeAreaInsets();

	useEffect(() => {
		let it: any;
		if (timer > 0) {
			it = setTimeout(() => setTimer(prev => prev - 1), 1000);
		}
		return () => clearTimeout(it);
	}, [timer]);
	
	useEffect(() => {
		const subscription = AppState.addEventListener('change', handleAppStateChange);

		return () => {
			subscription.remove();
		};
	}, []);
	
	function handleAppStateChange(nextAppState: AppStateStatus) {
		if (nextAppState === 'active') {
			navigation.goBack(); 
		}
	}
	
	useEffect(() => {
		if (unique_device_id === undefined) {
			getUniqueDeviceId().then(deviceId => {
				navigation.setParams({ unique_device_id: deviceId });
			});
		}
	}, [unique_device_id, navigation]);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			user_identifier,
			otp: '',
		},
	});
	const { styles, theme } = useStyles(stylesheet);

	function handleBack() {
		navigation.navigate(CONSTANTS.routes.Login, { user_identifier });
	}

	async function handleSendOtp() {
		setServerError('');
		const response = await server.post(CONSTANTS.endpoints.signin, {
			user_identifier,
			unique_device_id,
		});
		if (response.data?.success) {
			setTimer(60);
		} else {
			setServerError(response.data?.message);
		}
	}

	async function handleAuth(data: z.infer<typeof FormSchema>) {
		setServerError('');
		const { otp } = data;
		const response = await server.post(CONSTANTS.endpoints.authenticate, { user_identifier, otp });

		if (response.data?.success) {
			try {
				const userData = response.data.data;
				let permissions = [];

				if (userData.producer_id) {
					navigation.navigate('AccountSelect', { userData });
					return;
				} else if (userData.studio_id) {
					if (userData.user_id === userData.owner_id) {
						// TODO: change this hardcoded values to response values
						permissions = ['Messages::View', 'Messages::Edit', 'Calendar::View', 'Calendar::Edit'];
					} else {
						const res2 = await server.get(CONSTANTS.endpoints.studio_talent_permission(userData.studio_id, userData.user_id), {
							headers: {
								Authorization: 'Bearer ' + userData.token,
							},
						});
						permissions = res2.data?.data?.map(it => it.name);
					}
				}

				// temp: making call to check the role, get backend to send role directly in /auth
				const res = await server.get(CONSTANTS.endpoints.talent_about(userData?.user_id));
				const role = res.data?.data?.talent_role;

				setAuthInfo({
					loginType: userData.studio_id || role?.toLowerCase() === 'studio user' ? 'studio' : role?.toLowerCase() === 'talent manager' ? 'manager' : 'talent',
					permissions: JSON.stringify(permissions),
					authToken: userData.token || '',
					userId: userData.user_id || '',
					producerId: userData.producer_id || '',
					studioId: userData.studio_id || '',
					studioName: userData.studio_name || '',
					deviceId: unique_device_id,
					businessOwnerId: userData.business_owner_id || '',
					studioOwnerId: userData.owner_id || '',
				});
				if (!userData.first_name || !userData.last_name) {
					navigation.navigate('PersonalDetails');
				} else {
					navigation.reset({
						index: 0,
						routes: [{ name: 'TabNavigator' }],
					});
				}
			} catch (err: unknown) {}
		} else {
			setServerError(response.data?.message);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView style={{ justifyContent: 'space-between', flex: 1 }}>
				<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
				<View style={{ gap: theme.gap.xxl, paddingHorizontal: theme.padding.base }}>
					<View style={{ gap: theme.gap.base, maxWidth: 320 }}>
						<Text style={styles.heading}>OTP Verification</Text>
						<Text style={styles.paragraph}>We have sent you a verification code on your mobile number.</Text>
					</View>
					<Pressable style={[styles.userIdentifierTextContainer, styles.backButton]} onPress={handleBack}>
						<Text style={[styles.paragraph, { color: theme.colors.typography, textDecorationLine: 'underline' }]}>{user_identifier}</Text>
						<Pencil color={theme.colors.primary} size="22" />
					</Pressable>
					<Form {...form}>
						<View style={{ flexDirection: 'row' }}>
							<FormField
								control={form.control}
								name="otp"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<OTPInput value={createArray(field.value.split(''), 6)} onChange={value => field.onChange(value.join(''))} maxlength={6} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</View>
					</Form>
					<View>
						<View style={styles.codeNotReceivedContainer}>
							<Text style={[styles.paragraph, { fontSize: theme.fontSize.typographyLg }]}>Didn't receive the code?</Text>
							<Text
								style={[
									styles.paragraph,
									{
										fontSize: theme.fontSize.typographyLg,
										color: theme.colors.typography,
									},
								]}>
								00: {String(timer).padStart(2, '0')}
							</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Button isDisabled={!!timer} onPress={handleSendOtp} textColor={timer ? 'muted' : 'primary'} style={styles.resendButton}>
								Resend
							</Button>
						</View>
					</View>
				</View>
				<View>
					<Text style={styles.errorText(serverError)}>{serverError}</Text>
					<View style={styles.submitButton}>
						<Button onPress={form.handleSubmit(handleAuth)}>Verify</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export default Auth;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		fontFamily: 'CabinetGrotesk-Regular',
		justifyContent: 'space-between',
		paddingTop: StatusBar.currentHeight || 50,
	},
	paragraph: {
		color: theme.colors.typographyLight,
		fontSize: theme.fontSize.typographyLg,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	heading: {
		fontSize: theme.fontSize.primaryH1,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		textAlign: 'center',
		fontSize: theme.fontSize.primaryH2,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	userIdentifierTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 2,
	},
	backButton: {
		backgroundColor: 'transparent',
		paddingHorizontal: 0,
		paddingVertical: 0,
	},
	codeNotReceivedContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	resendButton: {
		backgroundColor: 'transparent',
		paddingVertical: 0,
		paddingHorizontal: 0,
	},
	errorText: (serverError: any) => ({
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	submitButton: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
}));
