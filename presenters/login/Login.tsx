import { useState } from 'react';
import { View, StatusBar, SafeAreaView, Keyboard, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import FormSchema from './schema';
import { AuthStorage, UrlStorage } from '@utils/storage';
import { Report } from '@touchblack/icons';
import CheckBox from '@components/Checkbox';
import { getUniqueDeviceId, registerDevice } from '@utils/getDeviceInfo';
import Select from '@components/Select';
import IValueWithId from '@models/entities/IValueWithId';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Login({ route, navigation }: any) {
	const user_identifier = route.params?.user_identifier;
	const [serverError, setServerError] = useState('');
	const [url, setUrl] = useState({ id: UrlStorage.getString('url'), name: UrlStorage.getString('url') });
	const insets = useSafeAreaInsets();
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			user_identifier: user_identifier,
			unique_device_id: AuthStorage.getString('device_id'),
			tnc_accepted: false,
		},
	});
	const { styles, theme } = useStyles(stylesheet);

	async function handleLogin(data: z.infer<typeof FormSchema>) {
		setServerError('');
		const response = await server.post(CONSTANTS.endpoints.signin, { ...data, unique_device_id: await getUniqueDeviceId() });
		if (response.data?.success) {
			navigation.navigate(CONSTANTS.routes.Auth, data);
		} else if (!response.data?.success) {
			setServerError(response.data?.message);
		}
	}

	async function handleDefaultUrl(value: IValueWithId) {
		await registerDevice();
		UrlStorage.set('url', value.name);
		setUrl(value);
	}

	return (
		<SafeAreaView style={[styles.container]}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -StatusBar.currentHeight || 0}>
				<View style={{ gap: 40, paddingHorizontal: 16, flex: 1 }}>
					<View style={{ gap: 16 }}>
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
									<FormItem style={{ justifyContent: 'flex-end' }}>
										{CONSTANTS.INTERNAL && (
											<Select
												items={[
													{ id: 'https://dev.talentgridnow.com', name: 'https://dev.talentgridnow.com' },
													{ id: 'https://test.talentgridnow.com', name: 'https://test.talentgridnow.com' },
													{ id: 'https://api.talentgridnow.com', name: 'https://api.talentgridnow.com' },
												]}
												style={{ marginBottom: 16 }}
												value={url}
												itemsToShow={3}
												placeholder="Select an environment"
												onChange={handleDefaultUrl}
											/>
										)}
										<FormLabel>Mobile number</FormLabel>
										<FormControl>
											<View style={{ flexDirection: 'row' }}>
												<TextInput editable={false} value={'+91'} style={[styles.textinput, styles.countryCodeText(serverError || form.formState.errors.user_identifier)]} />
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
													maxLength={10}
													style={[styles.textinput, styles.mobileNumberText(serverError || form?.formState?.errors?.user_identifier)]}
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
													<View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row', minWidth: '100%', flexWrap: 'wrap' }}>
														<Text size="bodyBig" color="muted">
															I have read & agree to the{' '}
														</Text>
														<Pressable onPress={() => navigation.navigate('TermsAndConditions')}>
															<Text size="bodyBig" color="primary">
																{' '}
																Terms of Use
															</Text>
														</Pressable>
														<Text size="bodyBig" color="muted">
															{' '}
															and
														</Text>
														<Pressable onPress={() => navigation.navigate('PrivacyPolicy')}>
															<Text size="bodyBig" color="primary">
																{' '}
																Privacy Policy
															</Text>
														</Pressable>
													</View>
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
						<Text style={{ textAlign: 'center' }} size="bodyMid" color="error">
							{serverError}
						</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Button onPress={form.handleSubmit(handleLogin)}>Login</Button>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

export default Login;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		fontFamily: 'CabinetGrotesk-Regular',
		justifyContent: 'space-between',
		paddingTop: StatusBar.currentHeight || 90,
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
		fontFamily: 'CabinetGrotesk-Regular',
	},
	countryCodeText: (error: any) => ({
		borderColor: error ? theme.colors.destructive : theme.colors.borderGray,
		aspectRatio: 1,
	}),
	mobileNumberText: (error: any) => ({
		flexGrow: 1,
		paddingHorizontal: 10,
		borderColor: error ? theme.colors.destructive : theme.colors.borderGray,
	}),
	notAMemberInlineButton: {
		alignItems: 'center',
		paddingBottom: theme.padding.xxl,
	},
	notAMemberText: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.cardHeading,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	errorText: (serverError: any) => ({
		color: theme.colors.destructive,
		flexDirection: 'row',
		justifyContent: 'center',
		gap: theme.gap.xxs,
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	}),
	buttonContainer: {
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
}));
