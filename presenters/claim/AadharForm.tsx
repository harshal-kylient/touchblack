import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Form, Text as UiText, FormControl, FormField, FormItem, FormLabel, FormMessage, TextInput } from '@touchblack/ui';

import Header from '@components/Header';
import { FormSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

function AadharForm({ route }) {
	const talentId = route.params?.id;
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState('');
	const navigation = useNavigation();

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			aadhar_number: '',
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		setServerError('');
		const response = await server.post(CONSTANTS.endpoints.aadhar_get_otp, data);
		if (!response.data?.success) {
			setServerError(response.data?.message);
			return;
		}
		navigation.navigate('AadharOTP', { aadhar: data.aadhar_number, id: talentId });
	}

	function handleTextChange(v, onChange) {
		setServerError('');
		v.length === 12 && Keyboard.dismiss();
		onChange(v);
	}

	return (
		<SafeAreaView style={styles.aadharScreenContainer}>
			<View style={{ gap: 40 }}>
				<Header name="Aadhar card details" />
				<Form {...form}>
					<FormField
						control={form.control}
						name="aadhar_number"
						render={({ field }) => (
							<FormItem style={{ paddingHorizontal: 16 }}>
								<FormLabel>Aadhar card number</FormLabel>
								<FormControl>
									<TextInput autoFocus={true} value={field.value} onChangeText={v => handleTextChange(v, field.onChange)} keyboardType="numeric" placeholder="XXXX XXXX XXXX XXXX" placeholderTextColor={theme.colors.typographyLight} maxLength={12} style={[styles.textinput, styles.aadharNumberText(serverError || form?.formState?.errors?.aadhar_number)]} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Form>
			</View>
			<View>
				<UiText style={{ paddingHorizontal: theme.padding.base }} size="bodyMid" color="regular">
					Why do we need your AADHAR number?{'\n'}
				</UiText>
				<UiText style={{ paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base }} size="bodyMid" color="muted">
					Talent Grid does not save all your AADHAR information. It is sent directly to the government-authorized UIDAI website to verify the full name of the user. This verification process complies with UIDAI guidelines and is conducted via a secure channel. This is done to ensure that you are the rightful owner of this talent profile. Rest assured, your data is handled with utmost security and privacy.
				</UiText>
				<View style={styles.errorView(serverError)}>
					<Text style={styles.errorText}>{serverError}</Text>
				</View>
				<View style={styles.submitButton}>
					<Button onPress={form.handleSubmit(onSubmit)}>Submit</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default AadharForm;

const stylesheet = createStyleSheet(theme => ({
	aadharScreenContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		justifyContent: 'space-between',
	},
	aadharNumberText: (error: any) => ({
		paddingHorizontal: 10,
		borderColor: error ? theme.colors.destructive : theme.colors.borderGray,
	}),
	submitButton: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
	errorText: {
		color: theme.colors.destructive,
		padding: 8,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	errorView: (serverError: any) => ({
		display: serverError ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
	},
}));
