import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Pressable, SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FormSchema2 } from './schema';
import { Pencil } from '@touchblack/icons';
import { StackActions, useNavigation } from '@react-navigation/native';
import OTPInput from '@components/OTPInput';
import * as z from 'zod';
import createArray from '@utils/createArray';
import { useEffect, useState } from 'react';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';

export default function OtpInput({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const [timer, setTimer] = useState(60);
	const [message, setMessage] = useState('');
	const email = route.params?.email;
	const filmId = route.params?.filmId;
	const userId = route.params?.userId;
	const type = route.params?.type;
	const navigation = useNavigation();
	const queryClient = useQueryClient();

	useEffect(() => {
		let it: any;
		if (timer > 0) {
			it = setTimeout(() => setTimer(prev => prev - 1), 1000);
		}
		return () => clearTimeout(it);
	}, [timer]);

	const form = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
		defaultValues: {
			otp: '',
		},
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

	const onSubmit = async (data: z.infer<typeof FormSchema2>) => {
		const res = await server.post(CONSTANTS.endpoints.verify_email, { email, otp: data.otp });
		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		}
		queryClient.invalidateQueries(['useGetUserDetails', userId]);
		navigation.dispatch(StackActions.pop(2));
		navigation.navigate('ReasonInput', { userId, filmId, type });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="OTP Verification" />
			<Form {...form}>
				<View style={{ paddingHorizontal: theme.padding.base, justifyContent: 'space-between', flex: 1 }}>
					<View style={{ gap: theme.gap.base }}>
						<Text size="bodyBig" style={{ marginBottom: theme.margins.base }} color="muted">
							We have sent you a verification code on your Email Id.
						</Text>
						<FormField
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<Pressable style={[styles.userIdentifierTextContainer, styles.backButton]} onPress={handleBack}>
											<Text style={[styles.paragraph, { color: theme.colors.typography, textDecorationLine: 'underline' }]}>{email}</Text>
											<Pencil color={theme.colors.primary} size="22" />
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
					<View style={{ position: 'absolute', flexDirection: 'row', bottom: 0, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						{message ? (
							<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
								<Text size="bodyMid" textAlign="center" color="error">
									{message}
								</Text>
							</Pressable>
						) : null}
						<Button style={{ flex: 1 }} onPress={form.handleSubmit(onSubmit)}>
							Verify
						</Button>
					</View>
				</View>
			</Form>
		</SafeAreaView>
	);
}

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
