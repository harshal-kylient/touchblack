import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSchema1, FormSchema2, FormSchema3 } from './schema';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Tag, Text, TextInput } from '@touchblack/ui';
import { createStyleSheet, useStyles, UnistylesRuntime } from 'react-native-unistyles';
import Asterisk from '@components/Asterisk';
import Select from '@components/Select';
import useGetProfessions from '@network/useGetProfessions';
import { ActivityIndicator, Keyboard, Modal, Pressable, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import Header from '@components/Header';
import useGetDistricts from '@network/useGetDistricts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Delete, Search as SearchIcon } from '@touchblack/icons';
import useGetAwards from '@network/useGetAwards';
import useGetShowreels from '@network/useGetShowreels';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import * as z from 'zod';
import useGetEducations from '@network/useGetEducations';
import { darkTheme } from '@touchblack/ui/theme';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import cloneDeep from 'lodash.clonedeep';
import IValueWithId from '@models/entities/IValueWithId';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import useGetTalentAwards from '@network/useGetTalentAwards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AutoComplete from '@components/AutoComplete';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetLanguagesSpoken from '@network/useGetLanguagesSpoken';

interface ILanguage {
	id: string;
	name: string;
	black_enum_type: string;
	description: string | null;
	extra_data: any | null;
	created_at: string;
	updated_at: string;
}
export default function UpdateTalentProfile() {
	const { styles, theme } = useStyles(stylesheet);
	const { userId, loginType, managerTalentId } = useAuth();
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [modalVisible, setModalVisible] = useState(false);
	const userID = loginType === 'manager' ? managerTalentId : userId;
	const talentId = loginType === 'manager' ? managerTalentId : '';
	const queryClient = useQueryClient();
	const [selectedLanguages, setSelectedLanguages] = useState<ILanguage[]>([]);
	const [message, setMessage] = useState({ msg: '', success: false });
	const { data: response1, isLoading: isProfessionsLoading, isError: isProfessionsError } = useGetProfessions();
	const professions = response1?.pages?.flatMap(page => page).map(it => ({ id: it.id, name: it.name })) || [];
	const { data: response } = useGetLanguagesSpoken();
	const languages = response?.pages?.flatMap(page => page) || [];
	const filteredLanguages = useMemo(() => {
		if (!languages) return [];

		return languages.filter(language => language?.name?.toLowerCase().includes(searchQuery.toLowerCase())).filter(language => !selectedLanguages.some(selected => selected.id === language.id));
	}, [searchQuery, languages, selectedLanguages]);
	

	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const insets = useSafeAreaInsets();

	const locationInputRef = useRef(null);
	const [locationQuery, setLocationQuery] = useState('');
	const { data: response2, isLoading: isDistrictsLoading, isError: isDistrictsError } = useGetDistricts(locationQuery);
	const districts = response2?.pages?.flatMap(page => page?.results).map(it => ({ id: it.id, name: it.name, state_id: it.state_id })) || [];

	const { data: response3, isLoading: isAwardsLoading, isError: isAwardsError } = useGetAwards();
	const awards = response3?.pages?.flatMap(page => page).map(it => ({ id: it.id, name: it.name })) || [];

	const { data: response4 } = useGetShowreels(userID!);
	const showreels = response4?.pages?.flatMap(page => page?.data).map(it => ({ id: it.film_id, name: it.film_name })) || [];

	const { data: response5 } = useGetEducations();
	const [educationQuery, setEducationQuery] = useState({ query: '', index: 0 });
	const institutes = response5?.pages?.flatMap(page => page) || [];

	const { data, isLoading: isUserDetailsLoading } = useGetUserDetailsById('User', userID!);

	const matchedLanguageIds = useMemo(() => {
		if (!data.user_languages?.length || !languages?.length) return [];
		return languages.filter(lang => data.user_languages.includes(lang.name)).map(lang => lang);
	}, [data.user_languages, languages]);

	useEffect(() => {
		setSelectedLanguages(prev => {
			if (JSON.stringify(prev) !== JSON.stringify(matchedLanguageIds)) {
				return matchedLanguageIds;
			}
			return prev;
		});
	}, [JSON.stringify(matchedLanguageIds)]);
	const { data: response6 } = useGetTalentAwards(userID!);
	const myawards = response6?.data;

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', event => {
			setScreenHeight(CONSTANTS.screenHeight - event.endCoordinates.height - headerHeight - insets.top - insets.bottom);
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

	const form1 = useForm<z.infer<typeof FormSchema1>>({
		resolver: zodResolver(FormSchema1),
		defaultValues: {
			bio: data?.bio,
			gender: CONSTANTS.GENDER.filter(it => it.name.toLowerCase() === data?.gender?.toLowerCase())[0],
			rate: String(Number(data?.rate)),
			first_name: data?.first_name,
			last_name: data?.last_name,
			dob: data?.dob,
			language_ids: selectedLanguages || [],
			profession_id: professions.find(it => it.name.toLowerCase() === data?.talent_role?.toLowerCase()),
			district_id: {
				id: data?.district_id || '',
				name: data?.city,
				state_id: data?.state_id || '',
			},
		},
	});

	const form2 = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
		defaultValues: {
			awards:
				myawards?.map(it => ({
					owner_award_id: it.owner_award_id,
					award_id: {
						id: it?.award?.id,
						name: it?.award?.name,
					},
					year_of_award: String(it?.year_of_award),
					film_id: {
						id: it?.film?.id,
						name: it?.film?.film_name,
					},
				})) || [],
		},
	});

	const form3 = useForm<z.infer<typeof FormSchema3>>({
		resolver: zodResolver(FormSchema3),
		defaultValues: {
			university: data?.institutes?.map(it => ({ id: { id: it?.institute_id, name: it?.name }, year_of_graduation: String(it?.year_of_graduation), user_institute_mapping_id: it?.user_institute_mapping_id })),
		},
	});

	function handleLanguageClick(language: ILanguage) {
		setSelectedLanguages(prev => [...prev, language]);
		setSearchQuery('');
		setModalVisible(false);
	}

	function handleRemoveLanguage(languageId: string) {
		setSelectedLanguages(prev => prev.filter(lang => lang.id !== languageId));
	}
	function transformer(data: z.infer<typeof FormSchema1>) {
		const res: any = {};
		res.bio = data.bio;
		if (data.district_id?.id) {
			res.district_id = data.district_id.id;
			res.country_id = CONSTANTS.INDIA_ID;
			res.state_id = data.district_id.state_id;
		}
		res.first_name = data.first_name;
		res.last_name = data.last_name;
		res.profession_id = data.profession_id.id;
		if (data.rate) {
			res.rate = data.rate;
		}
		res.language_ids = selectedLanguages.map(language => language.id);
		res.dob = data.dob;
		res.gender = data.gender.id;

		return res;
	}

	async function onSubmit1(data: z.infer<typeof FormSchema1>) {
		const res = await server.post(CONSTANTS.endpoints.update_manager_talent_profile(talentId), transformer(data));
		queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userID!]);
		setMessage({ msg: res.data?.message, success: res.data?.success });
		setSelectedLanguages([]);
	}
	async function onSubmit2(data: z.infer<typeof FormSchema2>) {
		const formdata = { awards: data.awards.map(it => ({ owner_award_id: it.owner_award_id, award_id: it.award_id.id, film_id: it.film_id.id, year_of_award: Number(it.year_of_award) })) };
		const res = await server.post(CONSTANTS.endpoints.update_talent_award(talentId), formdata);
		queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userID!]);
		setMessage({ msg: res.data?.message, success: res.data?.success });
	}

	async function onSubmit3(data: z.infer<typeof FormSchema3>) {
		const res = await server.post(CONSTANTS.endpoints.update_manager_talent_profile(talentId), { university: data.university.map(it => ({ id: it.id.id, user_institute_mapping_id: it.user_institute_mapping_id, year_of_graduation: Number(it.year_of_graduation) })) });
		queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userID!]);
		setMessage({ msg: res.data?.message, success: res.data?.success });
	}

	function handleDobInput(value: string, onChange: (value: string) => void) {
		const regex = /^[0-9-]+$/;
		const cleanedValue = value.replace(/[^0-9-]/g, ''); // Remove non-digit and non-hyphen characters

		onChange(cleanedValue);
	}

	if (isUserDetailsLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backgroundDarkBlack }}>
				<ActivityIndicator color={theme.colors.primary} />
			</View>
		);
	}

	function handleInstituteSelect(index, value) {
		const state = cloneDeep(form3.watch('university'));
		state[index] = {
			...state[index],
			id: value,
		};

		form3.setValue('university', state);
		setEducationQuery({ query: '', index });
	}

	function handleAddEducation() {
		const state = cloneDeep(form3.watch('university'));
		state.push({
			id: {
				id: '',
				name: '',
			},
			year_of_graduation: '',
		});

		form3.setValue('university', state);
	}

	function handleEducationYearChange(index, value) {
		const state = cloneDeep(form3.watch('university'));
		state[index] = {
			...state[index],
			year_of_graduation: value,
		};

		form3.setValue('university', state);
	}

	function handleDeleteEducation(index: number) {
		const x = async () => {
			const state = cloneDeep(form3.watch('university'));
			if (!state[index].user_institute_mapping_id) {
				state.splice(index, 1);
				form3.setValue('university', state);
				SheetManager.hide('Drawer');
				return;
			}

			const res = await server.post(CONSTANTS.endpoints.remove_talent_education(state[index].user_institute_mapping_id));
			if (res.data?.success) {
				state.splice(index, 1);
				form3.setValue('university', state);
				queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userID!]);
				SheetManager.hide('Drawer');
			}
			return res;
		};

		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.Delete, data: { text: 'Are you sure to delete this education entry?', header: 'Delete Education', onDismiss: () => SheetManager.hide('Drawer'), onDelete: x } },
		});
	}

	function handleAwardSelect(index, value) {
		const state = cloneDeep(form2.watch('awards'));
		state[index] = {
			...state[index],
			award_id: value,
		};

		form2.setValue('awards', state);
	}

	function handleFilmSelect(index, value) {
		const state = cloneDeep(form2.watch('awards'));
		state[index] = {
			...state[index],
			film_id: value,
		};

		form2.setValue('awards', state);
	}

	function handleYearChange(index, value) {
		const state = cloneDeep(form2.watch('awards'));
		state[index] = {
			...state[index],
			year_of_award: value,
		};

		form2.setValue('awards', state);
	}

	function handleAddAward() {
		const state = cloneDeep(form2.watch('awards'));
		state.push({
			owner_award_id: null,
			award_id: {
				id: '',
				name: '',
			},
			film_id: {
				id: '',
				name: '',
			},
			year_of_award: '',
		});

		form2.setValue('awards', state);
	}

	function handleDeleteAward(index: number) {
		const x = async () => {
			const state = cloneDeep(form2.watch('awards'));
			if (!state[index].owner_award_id) {
				state.splice(index, 1);
				form2.setValue('awards', state);
				SheetManager.hide('Drawer');
				return;
			}

			const res = await server.post(CONSTANTS.endpoints.remove_talent_award, { owner_award_id: state[index].owner_award_id });
			if (res.data?.success) {
				state.splice(index, 1);
				form2.setValue('awards', state);
				queryClient.invalidateQueries(['useGetTalentAwards', userID]);
				SheetManager.hide('Drawer');
			}
			return res;
		};

		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.Delete, data: { text: 'Are you sure to delete this award entry?', header: 'Delete Award', onDismiss: () => SheetManager.hide('Drawer'), onDelete: x } },
		});
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Edit Talent Profile" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<ScrollView bounces={false} style={{ paddingHorizontal: theme.padding.base }} contentContainerStyle={{ paddingBottom: 80, gap: theme.gap.base, backgroundColor: theme.colors.backgroundDarkBlack }}>
					<Form {...form1}>
						<Text size="primaryMid" color="regular">
							Basic Details
						</Text>
						<FormField
							name="first_name"
							control={form1.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										First Name (as per Aadhar) <Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput style={styles.textinput} value={field.value} onChangeText={field.onChange} placeholder="Enter First Name" placeholderTextColor={theme.colors.typographyLight} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="last_name"
							control={form1.control}
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Last Name (as per Aadhar) <Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput style={styles.textinput} value={field.value} onChangeText={field.onChange} placeholder="Enter Last Name" placeholderTextColor={theme.colors.typographyLight} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="dob"
							control={form1.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Dob</FormLabel>
									<FormControl>
										<TextInput style={styles.textinput} value={field.value} keyboardType="numbers-and-punctuation" maxLength={10} onChangeText={value => handleDobInput(value, field.onChange)} placeholder="Enter Dob in year-month-date format" placeholderTextColor={theme.colors.typographyLight} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form1.control}
							name="profession_id"
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Profession Type <Asterisk />
									</FormLabel>
									<FormControl>
										<Select value={field.value} onChange={field.onChange} placeholder="Select Talent Role" itemsToShow={5} items={professions} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="bio"
							control={form1.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<TextInput multiline style={[styles.textinput, { paddingTop: theme.padding.sm }]} value={field.value} onChangeText={field.onChange} placeholder="Enter Your Bio" placeholderTextColor={theme.colors.typographyLight} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form1.control}
							name="gender"
							rules={{ required: true }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Gender <Asterisk />
									</FormLabel>
									<FormControl>
										<Select value={field.value} onChange={field.onChange} placeholder="Select Gender" itemsToShow={4} items={CONSTANTS.GENDER} style={{ backgroundColor: theme.colors.black }} selectStyle={{ backgroundColor: theme.colors.black }} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form1.control}
							name="language_ids"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Languages</FormLabel>
									<FormControl>
										<View>
											<SearchInput placeholderText="Language" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
											{modalVisible && (
												<ScrollView style={styles.searchResultsContainer}>
													{filteredLanguages?.map(language => (
														<TouchableOpacity activeOpacity={0.9} onPress={() => handleLanguageClick(language)} key={language.id} style={styles.searchResultItem}>
															<Text size="primarySm" numberOfLines={1} color="regular">
																{language.name}
															</Text>
														</TouchableOpacity>
													))}
												</ScrollView>
											)}
										</View>
										{selectedLanguages.length > 0 && (
											<ScrollableHorizontalGrid>
												{selectedLanguages?.map((language: ILanguage) => (
													<Tag key={language.id} label={language.name} onPress={() => handleRemoveLanguage(language.id)} type={'actionable' as TagTypes} />
												))}
											</ScrollableHorizontalGrid>
										)}
									</FormControl>
									{locationQuery && Keyboard.isVisible() ? null : <FormMessage />}
								</FormItem>
							)}
						/>

						<FormField
							name="rate"
							control={form1.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rate Per Project</FormLabel>
									<FormControl>
										<TextInput style={[styles.textinput, { paddingLeft: 36 }]} keyboardType="numeric" value={field.value} onChangeText={field.onChange} placeholder="Enter Rate Per Shoot Day" placeholderTextColor={theme.colors.typographyLight} />
										<Text color="regular" size="button" style={{ position: 'absolute', top: 18, left: 18 }}>
											₹
										</Text>
										<Text color="muted" size="bodyMid" style={{ position: 'absolute', top: 20, right: 18 }}>
											/day
										</Text>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form1.control}
							name="district_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Home Location</FormLabel>
									<FormControl>
										<View style={styles.searchInputContainer}>
											<AutoComplete
												items={districts}
												placeholder="Select Home Location"
												value={field.value}
												onChange={(item: any) => {
													field.onChange(item);
													setLocationQuery('');
												}}
												onSearch={setLocationQuery}
												itemsToShow={3}
											/>
										</View>
									</FormControl>
									{locationQuery && Keyboard.isVisible() ? null : <FormMessage />}
								</FormItem>
							)}
						/>
						<Button onPress={form1.handleSubmit(onSubmit1)} type="primary">
							Update
						</Button>
					</Form>

					<Form {...form2}>
						<Text size="primaryMid" color="regular">
							Awards
						</Text>
						<FormField
							control={form2.control}
							name="awards"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										{field.value.map((it, index) => {
											return (
												<View>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
														<Text color="regular" size="bodyBig">
															Award {index + 1}
														</Text>
														<Pressable onPress={() => handleDeleteAward(index)} style={{ padding: theme.padding.xxs }}>
															<Delete size="20" color={theme.colors.primary} />
														</Pressable>
													</View>
													<Select items={awards} itemsToShow={5} value={it.award_id} onChange={value => handleAwardSelect(index, value)} placeholder="Select Awards" />
													<Select items={showreels} itemsToShow={5} onChange={value => handleFilmSelect(index, value)} value={it.film_id} placeholder="Select film for the award" />
													<TextInput style={styles.textinput} value={it.year_of_award} placeholder="Enter year of award" onChangeText={value => handleYearChange(index, value)} keyboardType="numeric" maxLength={4} />
												</View>
											);
										})}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Pressable onPress={handleAddAward}>
							<Text size="bodyBig" color="primary">
								Add Award
							</Text>
						</Pressable>
						{<Button onPress={form2.handleSubmit(onSubmit2)}>Update Awards</Button>}
					</Form>

					<Form {...form3}>
						<Text size="primaryMid" color="regular">
							Educations
						</Text>
						<FormField
							control={form3.control}
							name="university"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										{field.value?.map((it, index) => {
											const idx = index;
											return (
												<View>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
														<Text color="regular" size="bodyBig">
															Education {index + 1}
														</Text>
														<Pressable onPress={() => handleDeleteEducation(idx)} style={{ padding: theme.padding.xxs }}>
															<Delete size="20" color={theme.colors.primary} />
														</Pressable>
													</View>
													<View style={styles.searchInputContainer}>
														<AutoComplete items={institutes} itemsToShow={3} onSearch={value => setEducationQuery({ query: value, index: idx })} onChange={item => handleInstituteSelect(idx, item)} value={it.id} placeholder="Search Institute" />
													</View>
													<TextInput style={styles.textinput} value={it.year_of_graduation} placeholder="Enter year of gradution" onChangeText={value => handleEducationYearChange(index, value)} keyboardType="numeric" maxLength={4} />
												</View>
											);
										})}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Pressable onPress={handleAddEducation}>
							<Text size="bodyBig" color="primary">
								Add Education
							</Text>
						</Pressable>
						{<Button onPress={form3.handleSubmit(onSubmit3)}>Update Educations</Button>}
					</Form>
				</ScrollView>
				{message.msg ? (
					<Pressable onPress={() => setMessage({ msg: '', success: true })} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: theme.padding.xxl, paddingTop: theme.padding.base, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Text color={message.success ? 'primary' : 'error'} textAlign="center" size="bodyBig">
							{message.msg}
						</Text>
					</Pressable>
				) : null}
			</View>
		</SafeAreaView>
	);
}

function ValueCard({ text }: { text: string }) {
	return (
		<View style={{ flex: 1, padding: darkTheme.padding.base, backgroundColor: darkTheme.colors.black, borderWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
			<Text size="bodyBig" color="regular">
				{text}
			</Text>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		minHeight: 56,
		paddingLeft: theme.padding.xs,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		color: theme.colors.typography,
		fontSize: theme.fontSize.title,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	searchResultsContainer: {
		maxHeight: 230,
	},
	container: {
		zIndex: 1,
		paddingHorizontal: theme.padding.base,
	},
	searchContainer: {
		flex: 1,
		zIndex: 9,
		minHeight: 54,
		justifyContent: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
	},
	searchResultItem: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	searchInput: {
		alignSelf: 'center',
		width: '110%',
	},
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 999,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingLeft: 10,
		flex: 1,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	searchContainerWithResults: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.xxl,
		flex: 1,
	},
	textTag: {
		paddingLeft: theme.padding.xxs,
	},
	text: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		paddingTop: theme.padding.xxxxl,
	},
	inputContainer: {
		marginTop: theme.margins.base,
	},
	tabBg: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	searchInputContainer: {
		flex: 1,
		width: '100%',
		position: 'relative',
		justifyContent: 'center',
		zIndex: 9,
	},
	searchIcon: {
		position: 'absolute',
		zIndex: 99,
		height: '100%',
		width: 56,
		left: (3 * theme.padding.base) / 5,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	dropdownItems: {
		flex: 1,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItem: {
		borderBottomWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.xxs,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xl,
	},
}));
