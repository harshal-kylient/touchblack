import Header from '@components/Header';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { useForm } from 'react-hook-form';
import { Keyboard, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FormSchema3, ReasonEnumInternal, ReasonEnumMessage } from './schema';
import * as z from 'zod';
import { useNavigation } from '@react-navigation/native';
import Asterisk from '@components/Asterisk';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import Select from '@components/Select';
import AutoComplete from '@components/AutoComplete';
import useGetProfessions from '@network/useGetProfessions';
import { useEffect, useState } from 'react';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import EnumReportType from '@models/enums/EnumReportType';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReasonInput({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const user_id = route.params?.userId;
	const film_id = route.params?.filmId;
	const type = route.params?.type;
	const navigation = useNavigation();
	const [message, setMessage] = useState('');
	const [serverError, setServerError] = useState('');
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const insets = useSafeAreaInsets();

	function handleInputChange(text: string, field: any) {
		setServerError('');
		field.onChange(text);
	}

	const { data: response, isLoading } = useGetProfessions();
	const allProfessions = response?.pages?.flatMap(page => page);
	const [professions, setProfessions] = useState(allProfessions);

	function onSearch(query: string) {
		const data = allProfessions?.filter(it => it.name.toLowerCase().includes(query.toLowerCase()));
		setProfessions(data);
	}

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

	const form = useForm<z.infer<typeof FormSchema3>>({
		resolver: zodResolver(FormSchema3),
		defaultValues: {
			report_type: type === EnumReportType.User ? { id: ReasonEnumMessage['Inappropriate reasons'], name: 'Inappropriate reasons' } : undefined,
		},
	});

	const onSubmit = async (data: z.infer<typeof FormSchema3>) => {
		const report_type = data.report_type;
		const res = await server.post(CONSTANTS.endpoints.send_report, { ...data, report_type: data?.report_type?.id, role: data?.role?.id, user_id, film_id });

		if (!res.data?.success) {
			setMessage(res.data?.message || 'Something went wrong!');
			return;
		}

		let text = "Thank you for sharing the link. Hang tight while we dig in and make sure it's all good!";
		switch (report_type?.id) {
			case ReasonEnumInternal.broken_film_link:
				text = 'Thank you for sharing the link. Hang tight while the data team verifies and validates it.';
				break;
			case ReasonEnumInternal.missing_credit:
				text = 'Thanks for pointing out this credit mix-up! We’re on the case and getting to the bottom of it. Your patience is golden!';
				break;
			case ReasonEnumInternal.wrong_film_link:
				text = 'Thank you sharing the link. Hang tight while we dig in and make sure it’s all good!';
				break;
			case ReasonEnumInternal.wrong_production_house:
				text = 'Thanks for catching that production house mix-up! We’ll get that corrected faster than a director yells ‘action!’ Hang tight for the update!';
				break;
		}

		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: 'Report Raised Successfully',
					text,
					onPress: navigation.goBack,
				},
			},
		});
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Share Feedback" />
			<View style={{ paddingHorizontal: theme.padding.base, maxHeight: screenHeight, justifyContent: 'space-between', flex: 1 }}>
				<Form {...form}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						bounces={false}
						contentContainerStyle={{
							justifyContent: 'space-between',
							gap: theme.gap.xxl,
							paddingBottom: 84,
						}}>
						<View style={{ gap: theme.gap.base }}>
							<Text size="bodyBig" color="muted">
								See something wrong? Help us improve the platform. Report inaccurate information, inappropriate content, or missing details for the film.
							</Text>
							<FormField
								name="report_type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Reason
											<Asterisk />
										</FormLabel>
										<FormControl>
											<Select disabled={type === EnumReportType.User} itemsToShow={4} onChange={field.onChange} value={field.value} items={Object.entries(ReasonEnumMessage).map(it => ({ id: it[1], name: it[0] }))} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{form.watch('report_type')?.id === ReasonEnumInternal.missing_credit && (
								<FormField
									control={form.control}
									name="role"
									rules={{ required: true }}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Talent Type</FormLabel>
											<FormControl>
												<AutoComplete value={field.value} onChange={field.onChange} itemsToShow={5} items={professions} onSearch={onSearch} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{form.watch('report_type')?.id === ReasonEnumInternal.missing_credit && (
								<FormField
									name="talent_name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Talent Name</FormLabel>
											<FormControl>
												<TextInput placeholder="Enter talent name" value={field.value} onChangeText={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{form.watch('report_type')?.id !== ReasonEnumInternal.inappropriate_reasons && form.watch('report_type')?.id !== ReasonEnumInternal.other && (
								<FormField
									name="url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{form.watch('report_type')?.id === ReasonEnumInternal.wrong_film_link || form.watch('report_type')?.id === ReasonEnumInternal.broken_film_link ? 'Film URL' : 'URL'}</FormLabel>
											<FormControl>
												<TextInput keyboardType="url" placeholder="Enter URL" value={field.value} onChangeText={field.onChange} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							<FormField
								control={form.control}
								name="note"
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
														borderColor: serverError || form.formState.errors.note ? theme.colors.destructive : theme.colors.borderGray,
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
						</View>
					</ScrollView>
					<View style={{ position: 'absolute', flexDirection: 'row', bottom: 0, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						{message ? (
							<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
								<Text size="bodyMid" textAlign="center" color="error">
									{message}
								</Text>
							</Pressable>
						) : null}
						<Button type="secondary" textColor="regular" style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} onPress={navigation.goBack}>
							Cancel
						</Button>
						<Button style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} onPress={form.handleSubmit(onSubmit)}>
							Report
						</Button>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	baseMargin: {},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
}));
