import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Alert, Pressable, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FormSchema1 } from './schema';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import Asterisk from '@components/Asterisk';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useEffect, useState } from 'react';
import { Pencil } from '@touchblack/icons';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import useGetUserDetailsById from '@network/useGetUserDetailsById';

export default function AddYourEmail({}) {
	const { styles, theme } = useStyles(stylesheet);
	const [message, setMessage] = useState('');
	const navigation = useNavigation();
	const { userId, producerId, loginType } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const reporterId = loginType === 'producer' ? producerId : userId;
	const { data: talentData } = useGetUserDetailsById(userType, reporterId);
	const form = useForm<z.infer<typeof FormSchema1>>({
		resolver: zodResolver(FormSchema1),
	});
	
	const onSubmit = async (data: z.infer<typeof FormSchema1>) => {
		const res = await server.post(CONSTANTS.endpoints.send_email_otp, data);
		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		}
		navigation.navigate('OtpValidation', { ...data, userType, reporterId });
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Add Your Email" />
			<Form {...form}>
				<View style={styles.formContainer}>
					<View style={styles.inputWrapper}>
						<Text size="bodyBig" color="muted">
							Note: Please fill in the following details to verify your details in order to report.
						</Text>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => {
								useEffect(() => {
									if (talentData?.email) {
										form.setValue('email', talentData.email);
									}
								}, [talentData?.email]);

								return (
									<FormItem>
										<FormLabel>
											Email
											<Asterisk />
										</FormLabel>
										<FormControl>
											<View style={styles.inputContainer}>
												<TextInput keyboardType="email-address" placeholder="Enter your email" value={field.value} onChangeText={field.onChange} style={styles.textInput} />
												{talentData?.email && (
													<View style={styles.iconContainer}>
														<Pencil color={theme.colors.primary} size="22" />
													</View>
												)}
											</View>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</View>
					<View style={styles.footerContainer}>
						{message ? (
							<Pressable onPress={() => setMessage('')} style={styles.messageContainer}>
								<Text size="bodyMid" textAlign="center" color="error">
									{message}
								</Text>
							</Pressable>
						) : null}
						<Button style={styles.button} onPress={form.handleSubmit(onSubmit)}>
							Get OTP
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
	inputWrapper: { gap: theme.gap.base, flex: 1 },
	inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, backgroundColor: theme.colors.backgroundDarkBlack },
	textInput: { flex: 1 },
	iconContainer: { paddingHorizontal: theme.padding.base },
	footerContainer: { position: 'absolute', flexDirection: 'row', bottom: 0, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	messageContainer: { position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	button: { flex: 1 },
}));
