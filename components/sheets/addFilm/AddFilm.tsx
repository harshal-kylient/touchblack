import { useEffect, useState } from 'react';
import { Keyboard, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useForm } from 'react-hook-form';
import { SheetManager } from 'react-native-actions-sheet';
import { pick, types } from '@react-native-documents/picker';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import FormSchema from './schema';
import Asterisk from '@components/Asterisk';
import { SheetType } from 'sheets';
import server from '@utils/axios';
import jsonToFormdata from '@utils/jsonToFormData';
import CONSTANTS from '@constants/constants';
import AutoComplete from '@components/AutoComplete';
import useGetProducers from '@network/useGetProducers';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useAuth } from '@presenters/auth/AuthContext';
import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radio, RadioFilled } from '@touchblack/icons';
import { useQueryClient } from '@tanstack/react-query';

export default function AddFilm({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const { producerId, userId } = useAuth();
	const type = route.params?.type;
	const navigation = useNavigation();
	const [customInput, setCustomInput] = useState('');
	const [isOtherSelected, setIsOtherSelected] = useState(false);
	const onSuccess = () => {
		if (typeof route.params?.onSuccess === 'function') route.params?.onSuccess();
		navigation.goBack();
	};
	const [serverError, setServerError] = useState('');
	const [query, setQuery] = useState('');
	const { data, isLoading } = useGetProducers(query);
	const { data: producerDetails } = useGetUserDetailsById('Producer', producerId!);
	const producers = data?.pages?.flatMap(page => page?.results) || [];
	const enhancedProducers = [...producers, { id: '__others__', name: 'Others', label: 'Others', value: '__others__' }];
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	function handleInputChange(text: string, field: any) {
		setServerError('');
		field.onChange(text);
	}
	const form = useForm({
		resolver: zodResolver(FormSchema(type)),
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const isProducer = type === 'producer';
		const endpoint = isProducer ? CONSTANTS.endpoints.add_film : CONSTANTS.endpoints.add_showreel_film;

		let response;

		try {
			const submissionData = { ...data };

			if (type === 'talent' && data.owner_id) {
				if (typeof data.owner_id === 'object') {
					if (data.owner_id.id === '__other__') {				
						submissionData.owner_id = data.owner_id.name;
					} else {
						submissionData.owner_id = data.owner_id.id;
					}
				}
			}

			if (isProducer) {
				const formData = jsonToFormdata(submissionData);
				response = await server.postForm(endpoint, formData);
			} else {
				response = await server.post(endpoint, submissionData);
				
			}

			if (response.data?.success) {
				queryClient.invalidateQueries(['useGetOtherWorks']);
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.Success,
						data: {
							header: 'Success',
							text: response.data.message,
							onPress: onSuccess,
						},
					},
				});
			} else {
				setServerError(response.data?.message || 'Something went wrong, please try again.');
			}
		} catch (error) {
			setServerError('Unexpected error. Please try again later.');
		}
	}

	const handleProducerSelection = (value: any, field: any) => {
		if (value === '__others__' || (typeof value === 'object' && value?.value === '__others__')) {
			setIsOtherSelected(true);
			setCustomInput('');
			field.onChange({ id: '__others__', name: '' });
		} else {
			setIsOtherSelected(false);
			setCustomInput('');
			const selectedValue = typeof value === 'object' ? value : { id: value, name: value };
			field.onChange(selectedValue);
		}
	};

	const handleCustomInputChange = (text: string, field: any) => {
		setCustomInput(text);
		field.onChange({ id: userId, name: text });
		setServerError('');
	};

	const handleCancelCustomInput = (field: any) => {
		setIsOtherSelected(false);
		setCustomInput('');
		field.onChange(null);
	};

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
			setScreenHeight(CONSTANTS.screenHeight - event.endCoordinates.height - headerHeight - bottomHeight - insets.top - insets.bottom);
		});

		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setScreenHeight(CONSTANTS.screenHeight);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	const handleLayout2 = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setBottomHeight(height);
	};
	const workType = form.watch('work_type');

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Add New Film" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView
						contentContainerStyle={{
							gap: theme.gap.xl,
							justifyContent: 'space-between',
						}}>
						{type === 'talent' && (
							<FormField
								control={form.control}
								name="work_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel style={styles.formLabel}>
											Work_type <Asterisk />
										</FormLabel>
										<FormControl>
											<View style={styles.tabContainer}>
												<Pressable onPress={() => field.onChange('showreel')} style={[styles.tab, styles.borderL]}>
													{field.value === 'showreel' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
													<Text size="bodyMid" color="regular">
														Showreel
													</Text>
												</Pressable>
												<Pressable onPress={() => field.onChange('other_work')} style={styles.tab}>
													{field.value === 'other_work' ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
													<Text size="bodyMid" color="regular">
														Other work
													</Text>
												</Pressable>
											</View>
										</FormControl>
										<View style={{ marginLeft: theme.margins.base }}>
											<FormMessage />
										</View>
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="owner_id"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>
										Production House Name
										{type === 'talent' && workType === 'showreel' && <Asterisk />}
									</FormLabel>
									<FormControl>
										{type === 'talent' ? (
											isOtherSelected ? (
												<View style={{ flexDirection: 'row' }}>
													<TextInput
														value={customInput}
														onChangeText={text => handleCustomInputChange(text, field)}
														placeholder="Enter production house name"
														placeholderTextColor={theme.colors.typographyLight}
														style={[
															styles.textinput,
															styles.inputPadding,
															{
																borderColor: serverError || form.formState.errors.owner_id ? theme.colors.destructive : theme.colors.borderGray,
															},
														]}
													/>
													<Pressable onPress={() => handleCancelCustomInput(field)} style={styles.cancelButton}>
														<Text size="bodySm" color="primary">
															Cancel
														</Text>
													</Pressable>
												</View>
											) : (
												<AutoComplete items={enhancedProducers} itemsToShow={4} onChange={value => handleProducerSelection(value, field)} value={field.value} onSearch={setQuery} placeholder="Search Production House" />
											)
										) : (
											<TextInput
												value={field.value}
												onChangeText={v => handleInputChange(v, field)}
												defaultValue={producerDetails?.name}
												editable={false}
												placeholderTextColor={theme.colors.typographyLight}
												style={[
													styles.textinput,
													styles.inputPadding,
													{
														borderColor: serverError || form.formState.errors.owner_id ? theme.colors.destructive : theme.colors.borderGray,
													},
												]}
											/>
										)}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="film_name"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>
										Film Name <Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput
											value={field.value}
											onChangeText={v => handleInputChange(v, field)}
											placeholder="Please enter the film name"
											placeholderTextColor={theme.colors.typographyLight}
											style={[
												styles.textinput,
												styles.inputPadding,
												{
													borderColor: serverError || form.formState.errors.film_name ? theme.colors.destructive : theme.colors.borderGray,
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="film_link"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>
										Film URL (Youtube/Vimeo Link Only) <Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput
											value={field.value}
											onChangeText={v => handleInputChange(v, field)}
											keyboardType="url"
											placeholder="https://"
											placeholderTextColor={theme.colors.typographyLight}
											style={[
												styles.textinput,
												styles.inputPadding,
												{
													borderColor: serverError || form.formState.errors.film_link ? theme.colors.destructive : theme.colors.borderGray,
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="crew_link"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>
										Crew URL (Link as posted by Production house)
										{type === 'producer' && <Asterisk />}
									</FormLabel>
									<FormControl>
										<TextInput
											value={field.value}
											onChangeText={v => handleInputChange(v, field)}
											keyboardType="url"
											placeholder="https://"
											placeholderTextColor={theme.colors.typographyLight}
											style={[
												styles.textinput,
												styles.inputPadding,
												{
													borderColor: serverError || form.formState.errors.crew_link ? theme.colors.destructive : theme.colors.borderGray,
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem style={styles.baseMargin}>
									<FormLabel>Notes</FormLabel>
									<FormControl>
										<TextInput
											multiline
											value={field.value}
											onChangeText={v => handleInputChange(v, field)}
											placeholder="Write your thoughts here..."
											placeholderTextColor={theme.colors.typographyLight}
											style={[
												styles.textinput,
												{
													borderColor: serverError || form.formState.errors.notes ? theme.colors.destructive : theme.colors.borderGray,
													paddingTop: theme.padding.base,
													minHeight: 70,
												},
											]}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</ScrollView>
					<View onLayout={handleLayout2}>
						{serverError ? (
							<View style={{ paddingVertical: theme.padding.xxs, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.destructive }}>
								<Text size="bodyMid" textAlign="center" color="error">
									{serverError}
								</Text>
							</View>
						) : null}
						<View style={styles.footer}>
							<Button onPress={navigation.goBack} type="secondary" textColor="regular" style={styles.widthHalf}>
								Cancel
							</Button>
							<Button onPress={form.handleSubmit(onSubmit)} type="primary" textColor="black" style={styles.widthHalf}>
								Add
							</Button>
						</View>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	formLabel: { paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.xxs },
	tabContainer: {
		borderTopWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.base,
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tab: {
		padding: theme.padding.base,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	borderL: { borderLeftWidth: theme.borderWidth.slim },
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	xxlgap: { gap: theme.gap.xxl },
	xxxlBottomMargin: { marginBottom: theme.margins.xxxl },
	baseMargin: { marginHorizontal: theme.margins.base },
	widthHalf: { width: '50%', borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	footer: {
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	fileInputContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.xxxxl,
		paddingVertical: theme.padding.xxxxl,
		backgroundColor: theme.colors.black,
	},
	fileInputHeader: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
		color: theme.colors.borderGray,
	},
	fileInputText: {
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.borderGray,
	},
	cancelButton: {
		alignSelf: 'center',
		padding: theme.padding.xs,
	},
}));
