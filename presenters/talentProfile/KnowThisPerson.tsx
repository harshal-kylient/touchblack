import { View, StatusBar, SafeAreaView, TextInput, Keyboard } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Header from '@components/Header';
import { Avatar, Button, FormControl, FormLabel, FormMessage, Text, Form, FormField, FormItem } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { Person } from '@touchblack/icons';
import {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { knownPersonSchema, KnownPersonFormType } from './schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import z from 'zod';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { SheetManager } from 'react-native-actions-sheet';
import Asterisk from '@components/Asterisk';

function KnownPerson({ route }) {
	const id = route.params?.id;
	const { styles, theme } = useStyles(stylesheet);
	const { data: talentData } = useGetUserDetailsById('User', id);
	
	const navigation = useNavigation();
	const [serverError, setServerError] = useState('');
    
    const profile_link  = `https://ttgd.in/t/${id}`

	const form = useForm<KnownPersonFormType>({
		resolver: zodResolver(knownPersonSchema),
		defaultValues: {
			mobile_number: '',
			link: profile_link || '',
		},
	});

	const onSubmit = (values: KnownPersonFormType) => {
		setServerError('');
		 const data = {
				talent_id: id,
				talent_profile_link: profile_link,
				referred_number: values.mobile_number
			};
        knowThisPerson.mutate(data);
	};
    
    const knowThisPerson = useMutation({
		mutationFn: (data: any) => server.post(CONSTANTS.endpoints.know_this_person, data),
		onSuccess: data => {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'You are Awesome',
						text: 'Thanks for the Referral',
						onPress: () => navigation.goBack(),
					},
				},
			});
		},
		onError: (error: any) => {
			setServerError('Please try after some time');
		},
	});

	return (
		<SafeAreaView style={[styles.container]}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name="Known Person" />

			{/* Profile section */}
			<View style={styles.profileContainer}>
				<View style={styles.marginContainer}>
					<View style={styles.imageContainer}>{talentData?.profile_picture_url ? <Avatar style={styles.image} source={{ uri: createAbsoluteImageUri(talentData?.profile_picture_url) }} /> : <Person size="113" color={theme.colors.muted} />}</View>
					<View style={styles.contentContainer}>
						<View style={styles.nameContainer}>
							<Text style={styles.talentName} numberOfLines={1} color="regular" size="primarySm" weight="bold">
								{capitalized((talentData?.first_name || '') + ' ')} {capitalized((talentData?.last_name || '') + ' ')}
							</Text>
						</View>
						<Text style={styles.talentRole} numberOfLines={1} color="regular" size="primarySm" weight="regular">
							{capitalized(talentData?.talent_role)}
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.instructionContainer}>
				<Text size="button" color="muted">
					Please enter the mobile number of {talentData?.first_name} {talentData?.last_name} below to notify them about this profile.
				</Text>
			</View>
			<Form {...form}>
				{/* Mobile number field */}
				<View style={styles.formView}>
					<FormField
						control={form.control}
						name="mobile_number"
						render={({ field }) => (
							<FormItem style={{ marginBottom: 25 }}>
								<FormLabel>
									Mobile number<Asterisk />
								</FormLabel>
								<FormControl>
									<View style={{ flexDirection: 'row' }}>
										<TextInput editable={false} value={'+91'} style={[styles.textinput, styles.countryCodeText(serverError || form.formState.errors.mobile_number)]} />
										<TextInput
											value={field.value}
											onChangeText={v => {
												setServerError('');
												v.length === 10 && Keyboard.dismiss();
												field.onChange(v);
											}}
											keyboardType="numeric"
											placeholder="Enter mobile number"
											placeholderTextColor={theme.colors.typographyLight}
											maxLength={10}
											style={[styles.textinput, styles.mobileNumberText(serverError || form.formState.errors.mobile_number)]}
										/>
									</View>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Prefilled link field */}
					<FormField
						control={form.control}
						name="link"
						render={({ field }) => (
							<FormItem>
								<FormLabel> Profile Link</FormLabel>
								<FormControl>
									<TextInput value={profile_link} editable={false} style={[styles.textinput, { opacity: 0.6 }]} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</View>
			</Form>

			{/* Submit button */}
			<View style={styles.buttonContainer}>
				<Button onPress={form.handleSubmit(onSubmit)} textColor="black" type="primary" style={styles.button}>
					Submit
				</Button>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		zIndex: 1,
	},
	instructionContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
	},
	formView: {
		flex: 1,
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		
	},
	profileContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		marginBottom: theme.margins.xxl,
	},
	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: theme.margins.xxxs,
	},
	marginContainer: {
		marginLeft: theme.margins.base * 2,
		marginRight: theme.margins.xl * 1.5,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		maxHeight: 902,
		alignItems: 'center',
	},
	image: {
		aspectRatio: 1 / 1,
		objectFit: 'cover',
		height: '100%',
		position: 'relative',
	},
	imageContainer: {
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	contentContainer: {
		paddingHorizontal: theme.padding.base,
	},
	icon: {
		padding: theme.padding.xxs,
		backgroundColor: 'transparent',
	},
	talentName: {
		opacity: 0.8,
	},
	talentRole: {
		opacity: 0.8,
		marginTop: theme.margins.xxxs,
	},
	loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	buttonContainer: {
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.base,
	},
	button: {
		flexGrow: 1,
		marginTop: theme.padding.xs,
		marginBottom: theme.margins.xxxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
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
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
		minHeight: 56,
		padding: theme.padding.base,
	},
}));

export default KnownPerson;
