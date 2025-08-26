import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Pressable, SafeAreaView, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { FormSchema1 } from './schema';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import Asterisk from '@components/Asterisk';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useState } from 'react';

export default function EmailInput({ route }) {
	const { theme } = useStyles();
	const filmId = route.params?.filmId;
	const userId = route.params?.userId;
	const type = route.params?.type;
	const [message, setMessage] = useState('');
	const navigation = useNavigation();

	const form = useForm<z.infer<typeof FormSchema1>>({
		resolver: zodResolver(FormSchema1),
	});

	const onSubmit = async (data: z.infer<typeof FormSchema1>) => {
		const res = await server.post(CONSTANTS.endpoints.send_email_otp, data);
		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		}
		navigation.navigate('OtpInput', { userId, filmId, type, ...data });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Verify your account" />
			<Form {...form}>
				<View style={{ paddingHorizontal: theme.padding.base, justifyContent: 'space-between', flex: 1 }}>
					<View style={{ gap: theme.gap.base, flex: 1 }}>
						<Text size="bodyBig" color="muted">
							Please fill in the following details to verify your details in order to report.
						</Text>
						<FormField
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Email
										<Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput keyboardType="email-address" placeholder="Enter your email" value={field.value} onChangeText={field.onChange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
							Get OTP
						</Button>
					</View>
				</View>
			</Form>
		</SafeAreaView>
	);
}
