import { useCallback, useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View, Text, StatusBar, SafeAreaView } from 'react-native';
import { useForm } from 'react-hook-form';

import { Button, Form, FormControl, FormField, FormItem, FormMessage } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AadharOTPFormSchema from './schema';
import Header from '@components/Header';
import OTPInput from '@components/OTPInput';
import createArray from '@utils/createArray';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import Success from './Success';
import { useNavigation } from '@react-navigation/native';

function AadharOTP({ route }) {
	const aadhar = route.params?.aadhar;
	const talentId = route.params?.id;
	const [timer, setTimer] = useState(60);
	const [serverError, setServerError] = useState({ success: false, message: '' });
	const [created, setCreated] = useState(false);
	const navigation = useNavigation();

	useEffect(() => {
		let it: any;
		if (timer > 0) {
			it = setTimeout(() => setTimer(prev => prev - 1), 1000);
		}
		return () => clearTimeout(it);
	}, [timer]);

	const form = useForm({
		resolver: zodResolver(AadharOTPFormSchema),
		defaultValues: {
			otp: '',
		},
	});
	const { styles, theme } = useStyles(stylesheet);

	async function handleSendOtp() {
		setServerError({ success: false, message: '' });
		const response = await server.post(CONSTANTS.endpoints.aadhar_get_otp, { aadhar_number: aadhar });
		if (!response.data?.success) {
			setServerError({ success: false, message: response.data?.message || 'Something Went Wrong' });
			return;
		}
		setTimer(60);
		setServerError({ success: true, message: response.data?.message });
	}

	async function onSubmit(data: z.infer<typeof AadharOTPFormSchema>) {
		setServerError({ success: false, message: '' });
		const response = await server.post(CONSTANTS.endpoints.aadhar_verify_otp, data);
		if (!response.data?.success) {
			setServerError({ success: response.data?.success, message: response.data?.message || 'Something Went Wrong' });
			return;
		}
		const claim = await server.post(CONSTANTS.endpoints.claim(talentId));
		const claimResponse = claim.data;
		console.log('CLAIM', claim.data);

		if (claimResponse?.success) {
			setCreated(true);
		} else {
			setServerError({ success: response.data?.success, message: response.data?.message || 'Something Went Wrong' });
			return;
		}
	}

	const handleSuccess = useCallback(() => {
		setCreated(false);
		navigation.pop(2);
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name="OTP Verification" />
			<View style={{ flex: 1, justifyContent: 'space-between' }}>
				<View style={{ gap: theme.gap.xxl, paddingHorizontal: theme.padding.base }}>
					<View style={{ gap: theme.gap.base, maxWidth: 320 }}>
						<Text style={styles.paragraph}>We have sent you a verification code on your Aadhar Card registered mobile number i.e.</Text>
					</View>
					<View style={styles.userIdentifierTextContainer}>
						<Text style={[styles.paragraph, { color: theme.colors.primary }]}>{aadhar.split('').map((it, index) => (index < 8 ? 'X' : it))}</Text>
					</View>
					<Form {...form}>
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
					<View style={styles.errorView(serverError.success, serverError.message)}>
						<Text style={styles.errorText(serverError.success)}>{serverError.message}</Text>
					</View>
					<View style={styles.submitButton}>
						<Button onPress={form.handleSubmit(onSubmit)}>Verify</Button>
					</View>
				</View>
			</View>
			{created && <Success header="Bravo! Your account verification process is underway." text="We appreciate your patience and cooperation. Thankyou for being a star!" onDismiss={handleSuccess} onPress={handleSuccess} />}
		</SafeAreaView>
	);
}

export default AadharOTP;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
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
		backgroundColor: theme.colors.black,
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
		textDecorationLine: 'underline',
		marginTop: theme.margins.xxs,
	},
	errorText: (success: any) => ({
		color: success ? theme.colors.success : theme.colors.destructive,
		padding: 8,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
	}),
	errorView: (success: any, message: any) => ({
		display: message ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: success ? theme.colors.success : theme.colors.destructive,
	}),
	submitButton: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
}));
