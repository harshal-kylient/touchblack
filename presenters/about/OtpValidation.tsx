import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Alert, Platform, Pressable, SafeAreaView, ToastAndroid, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FormSchema2 } from './schema';
import { Pencil } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import OTPInput from '@components/OTPInput';
import * as z from 'zod';
import createArray from '@utils/createArray';
import { useEffect, useState } from 'react';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';

export default function OtpValidation({ route }) {
	const { styles } = useStyles(stylesheet);
	const userType = route.params?.userType;
	const reporterId = route.params?.reporterId;
	const [timer, setTimer] = useState(60);
	const [message, setMessage] = useState('');
	const email = route.params?.email;
	const navigation = useNavigation();
	const queryClient = useQueryClient();

	useEffect(() => {
		let it;
		if (timer > 0) {
			it = setTimeout(() => setTimer(prev => prev - 1), 1000);
		}
		return () => clearTimeout(it);
	}, [timer]);

	const form = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
		defaultValues: { otp: '' },
	});

	const handleSendOtp = async () => {
		const res = await server.post(CONSTANTS.endpoints.send_email_otp, { email });
		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		}
		setTimer(60);
	};

	const handleBack = () => {
		navigation.goBack();
	};

	const onSubmit = async data => {
		const res = await server.post(CONSTANTS.endpoints.verify_email, { email, otp: data.otp });
		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		} else {
			if (Platform.OS === 'android') {
				ToastAndroid.show(res.data?.message, ToastAndroid.SHORT);
			} else {
				Alert.alert('Alert', res.data?.message);
			}

			queryClient.invalidateQueries(['useGetUserDetailsById', userType, reporterId]);
			navigation.navigate('AddYourEmail');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="OTP Verification" />
			<Form {...form}>
				<View style={styles.formContainer}>
					<View style={styles.contentContainer}>
						<Text size="bodyBig" style={styles.instructionText} color="muted">
							We have sent you a verification code on your Email Id.
						</Text>
						<FormField
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Pressable style={[styles.userIdentifierTextContainer, styles.backButton]} onPress={handleBack}>
											<Text style={styles.emailText}>{email}</Text>
											<Pencil color={styles.pencilColor.color} size="22" />
										</Pressable>
									</FormLabel>
									<FormControl>
										<OTPInput value={createArray(field.value.split(''), 6)} onChange={value => field.onChange(value.join(''))} maxlength={6} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<View>
							<View style={styles.codeNotReceivedContainer}>
								<Text style={styles.codeText}>Didn't receive the code?</Text>
								<Text style={styles.timerText}>00: {String(timer).padStart(2, '0')}</Text>
							</View>
							<Button isDisabled={!!timer} onPress={handleSendOtp} textColor={timer ? 'muted' : 'primary'} style={styles.resendButton}>
								Resend
							</Button>
						</View>
					</View>
					<View style={styles.bottomContainer}>
						{message ? (
							<Pressable onPress={() => setMessage('')} style={styles.errorMessage}>
								<Text size="bodyMid" textAlign="center" color="error">
									{message}
								</Text>
							</Pressable>
						) : null}
						<Button style={styles.verifyButton} onPress={form.handleSubmit(onSubmit)}>
							Verify
						</Button>
					</View>
				</View>
			</Form>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: { flex: 1, backgroundColor: theme.colors.backgroundDarkBlack },
	formContainer: { paddingHorizontal: theme.padding.base, justifyContent: 'space-between', flex: 1 },
	contentContainer: { gap: theme.gap.base },
	instructionText: { marginBottom: theme.margins.base },
	userIdentifierTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
	emailText: { color: theme.colors.typography, textDecorationLine: 'underline' },
	pencilColor: { color: theme.colors.primary },
	codeNotReceivedContainer: { flexDirection: 'row', justifyContent: 'space-between' },
	codeText: { fontSize: theme.fontSize.typographyLg },
	timerText: { fontSize: theme.fontSize.typographyLg, color: theme.colors.typography },
	resendButton: { backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 0 },
	bottomContainer: { position: 'absolute', flexDirection: 'row', bottom: 0, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	errorMessage: { position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	verifyButton: { flex: 1 },
}));
