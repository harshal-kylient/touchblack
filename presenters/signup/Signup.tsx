import { useState } from 'react';
import { View, StatusBar, SafeAreaView, Keyboard, Pressable } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';
import { Button, Text, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, TextInput } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import server from '@utils/axios';
import CheckBox from '@components/Checkbox';
import CONSTANTS from '@constants/constants';
import { AuthStorage } from '@utils/storage';
import FormSchema from './schema';
import { Report } from '@touchblack/icons';

function Signup({ navigation }: any) {
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			user_identifier: '',
			unique_device_id: AuthStorage.getString('device_id'),
			tnc_accepted: false,
		},
	});
	const [serverError, setServerError] = useState('');
	const { styles, theme } = useStyles(stylesheet);

	async function handleSignup(data: z.infer<typeof FormSchema>) {
		setServerError('');
		const response = await server.post(CONSTANTS.endpoints.signup, data);
		if (response.data?.success) {
			AuthStorage.set('registered', true);
			navigation.navigate(CONSTANTS.routes.Auth, {
				user_identifier: data.user_identifier,
			});
		} else if (!response.data?.success) {
			setServerError(response.data?.message);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={{ gap: 40, paddingHorizontal: 16, flex: 1 }}>
				<View style={{ gap: 16, maxWidth: 320 }}>
					<Text size="bodyMid" style={styles.heading}>
						Hello there!
					</Text>
					<Text size="bodyMid" style={styles.paragraph}>
						Please enter your mobile number to create an account with Talent Grid
					</Text>
				</View>
				<Form {...form}>
					<View style={{ flex: 1, justifyContent: 'space-between', paddingBottom: theme.padding.lg }}>
						<FormField
							control={form.control}
							name="user_identifier"
							render={({ field }) => (
								<FormItem style={{ backgroundColor: theme.colors.transparent }}>
									<FormLabel>Mobile number</FormLabel>
									<FormControl>
										<View style={{ flexDirection: 'row' }}>
											<TextInput editable={false} value={'+91'} style={[styles.textinput, styles.countryCodeText(serverError, form)]} />
											<TextInput
												value={field.value}
												onChangeText={v => {
													setServerError('');
													v.length === 10 && Keyboard.dismiss();
													field.onChange(v);
												}}
												keyboardType="numeric"
												placeholder="_ _"
												placeholderTextColor={theme.colors.typographyLight}
												returnKeyType="send"
												maxLength={10}
												style={[styles.textinput, styles.mobileNumberText(serverError, form)]}
											/>
										</View>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tnc_accepted"
							render={({ field }) => (
								<FormItem style={{ backgroundColor: theme.colors.transparent }}>
									<FormControl>
										<CheckBox
											content={
												<>
													<Text size="bodyBig" color="muted">
														I have read & agree to the{' '}
													</Text>
													<Pressable onPress={() => navigation.navigate('TermsAndConditions')}>
														<Text size="bodyBig" color="primary">
															{' '}
															Terms of Use
														</Text>
													</Pressable>
												</>
											}
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</View>
				</Form>
			</View>
			<View>
				<View style={styles.errorText(serverError)}>
					<Report size="24" color={theme.colors.destructive} />
					<Text size="bodyMid" color="error" style={{ textAlign: 'center' }}>
						{serverError}
					</Text>
				</View>
				<View style={styles.cta}>
					<Button onPress={form.handleSubmit(handleSignup)}>Signup</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default Signup;

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
	countryCodeText: (serverError: any, form: any) => ({
		borderColor: serverError || form.formState.errors.user_identifier ? theme.colors.destructive : theme.colors.borderGray,
		color: theme.colors.typography,
	}),
	mobileNumberText: (serverError: any, form: any) => ({
		flexGrow: 1,
		paddingHorizontal: 10,
		borderColor: serverError || form.formState.errors.user_identifier ? theme.colors.destructive : theme.colors.borderGray,
	}),
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	errorText: (error: string | undefined) => ({
		flexDirection: 'row',
		justifyContent: 'center',
		gap: theme.gap.xxs,
		alignItems: 'center',
		padding: 10,
		display: error ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	}),
	cta: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: theme.colors.borderGray,
	},
}));
