import Header from '@components/Header';
import { Keyboard, Modal, Pressable, SafeAreaView, TouchableOpacity, Text as RNText, View, Image, TextInput as RNTextInput } from 'react-native';
import { Accordion, Button, Form, FormControl, FormField, FormItem, FormMessage, Slideable, Text, TextInput } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema2 } from './schema';
import Animated, { useSharedValue } from 'react-native-reanimated';
import * as z from 'zod';
import { ProjectStorage } from '@utils/storage';
import { Timer, Search as SearchIcon, Calendar, AddCircled, Delete } from '@touchblack/icons';
import capitalized from '@utils/capitalized';
import { useEffect, useRef, useState } from 'react';
import useGetAllTalentTypes from '@network/useGetAllTalentTypes';
import { useProjectsContext } from '../ProjectContext';
import { FlashList } from '@shopify/flash-list';
import { StackActions, useNavigation } from '@react-navigation/native';
import IValueWithId from '@models/entities/IValueWithId';
import UserItem from '@components/UserItem';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import IAvailableTalent from '@models/dtos/IAvailableTalent';
import SelectionGuide from './SelectionGuide';
import EnumStatus from '@models/enums/EnumStatus';
import { useStudioBookingContext } from '@presenters/studio/booking/StudioContext';

interface IProjectTalent {
	dates: string[];
	profession_id: {
		id: string;
		name: string;
	};
	project_id: string | null;
	talent_ids: {
		id: string;
		first_name: string;
		last_name: string;
		profile_picture_url: string;
		location: string;
		Is_bookmarked: boolean;
		profession: string;
	}[];
}

export default function CreateProjectStep2() {
	const height = useSharedValue(0);
	const { state, dispatch } = useProjectsContext();
	const { state: studioState, dispatch: studioDispatch } = useStudioBookingContext();
	const { styles, theme } = useStyles(stylesheet);
	const [talentTypeQuery, setTalentTypeQuery] = useState('');
	const [modalVisible, setModalVisible] = useState(false);

	const { data: response, isLoading, isError } = useGetAllTalentTypes();
	const data = response?.map(it => ({ id: it.id, name: it.name }));
	const filteredData = data?.filter(it => !state.talent_selection_details.project_invitations.some(item => it.id === item.profession_id.id) && it?.name?.toLowerCase()?.includes(talentTypeQuery?.trim()?.toLowerCase()));

	const talentTypeRef = useRef<RNTextInput>(null);
	const navigation = useNavigation();
	const [showGuide, setShowGuide] = useState(true);

	const form = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
		defaultValues: {
			project_invitations: state.talent_selection_details.project_invitations,
		},
	});

	function handleSearch(query: string) {
		const alias = 'search-history-';
		if (!query || query === ProjectStorage.getString(alias + '3')) {
			return;
		}
		const secondHistory = ProjectStorage.getString(alias + '1');
		const thirdHistory = ProjectStorage.getString(alias + '2');
		const fourthHistory = ProjectStorage.getString(alias + '3');

		ProjectStorage.set(alias + '0', secondHistory || '');
		ProjectStorage.set(alias + '1', thirdHistory || '');
		ProjectStorage.set(alias + '2', fourthHistory || '');
		ProjectStorage.set(alias + '3', capitalized(query));
	}

	useEffect(() => {
		if (typeof data?.length === 'number') {
			height.value = data?.length > 5 ? 5 * 57 : data?.length * 57;
		}
	}, [height, data]);

	function handleDone() {
		navigation.goBack();
	}

	function handleHireLocation() {
		studioDispatch({ type: 'PROJECT_ID', value: { id: state.project_details.project_id, name: state.project_details.project_name } });
		navigation.navigate('StudioBookingStep1');
	}

	function handleSubmit() {
		form.setValue('project_invitations', state.talent_selection_details.project_invitations);
		form.handleSubmit(onSubmit)();
	}

	function onSubmit(data: z.infer<typeof FormSchema2>) {
		dispatch({ type: 'CURRENT_STEP', value: 2 });
		navigation.navigate('CreateProjectStep3');
	}

	function onAddPress(item: IProjectTalent) {
		navigation.navigate('ProjectTalentSearch', { profession: { id: item.profession_id.id, name: item.profession_id.name }, dates: item.dates });
	}

	function handleDelete(profession: IValueWithId, item: IAvailableTalent) {
		dispatch({ type: 'TALENT_SELECTION_REMOVE_TALENT', value: { profession, talent: item } });
	}

	function handleSetDate(value: { dates: string[]; from_time: string; to_time: string; profession: IValueWithId }) {
		dispatch({ type: 'TALENT_SELECTION_DATES', value });
		navigation.dispatch(StackActions.replace('ProjectTalentSearch', { profession: value.profession }));
	}

	function handleDateSelect(value: IValueWithId) {
		const storeData = selectedDates(value.id);
		navigation.navigate('CreateProjectStep3', { value: { profession: value, dates: storeData?.dates, from_time: storeData?.from_time, to_time: storeData?.to_time }, onChange: (args: { dates: string[]; from_time: string; to_time: string; profession: IValueWithId }) => handleSetDate(args) });
	}

	function handleProfessionSelect(item: IValueWithId) {
		handleSearch(item.name);
		dispatch({ type: 'TALENT_SELECTION_ADD_PROFSSION', value: item });
		setTalentTypeQuery('');
		setModalVisible(false);
		Keyboard.dismiss();
		handleDateSelect(item);
	}

	function handleRemoveProfession(item: IValueWithId) {
		dispatch({ type: 'TALENT_SELECTION_REMOVE_PROFESSION', value: item });
	}

	function handleSuggestionClick(index: number) {
		const str = 'search-history-' + index;
		setTalentTypeQuery(ProjectStorage.getString(str));
		setModalVisible(true);
	}

	function renderUserItem(profession, it) {
		for (let item of state.talent_selection_details_default.project_invitations) {
			if (item.profession_id.id !== profession.id) continue;
			for (let talent of item.talent_ids) {
				if (talent.id === it.id)
					return (
						<UserItem
							name={(it.first_name || '') + ' ' + (it.last_name || '')}
							id={it.id}
							city={it.city}
							profession={it.profession_type}
							image={createAbsoluteImageUri(it.profile_picture_url)}
							cta={
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.gap.base }}>
									{it.status !== EnumStatus.Enquiry ? (
										<Text size="bodyBig" color="muted">
											{it.status}
										</Text>
									) : it.status === EnumStatus.Confirmed ? (
										<Text size="bodyBig" style={{ color: theme.colors.success }}>
											{it.status}
										</Text>
									) : it.status === EnumStatus.Opted_out ? (
										<Text size="bodyBig" color="error">
											{it.status}
										</Text>
									) : it.status === EnumStatus.Tentative ? (
										<Text size="bodyBig" style={{ color: theme.colors.verifiedBlue }}>
											{it.status}
										</Text>
									) : it.status !== EnumStatus.Not_available ? (
										<Text size="bodyBig" color="muted">
											{it.status}
										</Text>
									) : null}
								</View>
							}
						/>
					);
			}
		}

		return (
			<Slideable
				key={it.id}
				onButtonPress={() => handleDelete(profession, it)}
				buttonElement={
					<View style={styles.buttonElement}>
						<Delete size="24" strokeColor={theme.colors.black} color={theme.colors.black} />
						<Text size="cardSubHeading" color="black">
							Delete
						</Text>
					</View>
				}>
				<UserItem name={(it.first_name || '') + ' ' + (it.last_name || '')} id={it.id} city={it.city} profession={it.profession_type} image={createAbsoluteImageUri(it.profile_picture_url)} />
			</Slideable>
		);
	}

	const selectedDates = (profession_id: UniqueId) => state.talent_selection_details.project_invitations.find(it => it.profession_id.id === profession_id);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Talent Selection" style={{ zIndex: -9 }} />
			<Text size="button" color="muted" style={{ padding: theme.padding.base }}>
				You can add multiple talents to this project
			</Text>
			<Form {...form}>
				<Animated.ScrollView
					style={styles.container}
					bounces={false}
					contentContainerStyle={{
						justifyContent: 'space-between',
						gap: theme.gap.xxl,
						paddingBottom: 84,
						backgroundColor: theme.colors.backgroundDarkBlack,
					}}>
					<FormField
						control={form.control}
						name="project_invitations"
						render={() => (
							<FormItem style={{ paddingHorizontal: theme.padding.base }}>
								<FormControl>
									<View style={styles.searchInputContainer}>
										<Pressable onPress={() => setModalVisible(true)} style={styles.searchContainer}>
											<SearchIcon style={styles.searchIcon} color="white" size="22" />
											<View style={styles.searchInput}>
												<Text color="muted" size="bodyBig">
													Search Talent Role
												</Text>
											</View>
										</Pressable>
										{modalVisible ? (
											<Modal animationType="none" transparent={true} onRequestClose={() => setTalentTypeQuery('')}>
												<Pressable
													style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}
													onPress={() => {
														setTalentTypeQuery('');
														setModalVisible(false);
													}}>
													<SafeAreaView style={{ flex: 1 }}>
														<View
															style={{
																position: 'absolute',
																top: 120,
																left: 0,
																right: 0,
																marginHorizontal: theme.margins.base,
															}}>
															<View style={[styles.searchContainer]}>
																<SearchIcon style={styles.searchIcon} color="white" size="22" />
																<TextInput value={talentTypeQuery} autoFocus ref={talentTypeRef} onSubmitEditing={e => setTalentTypeQuery(e.nativeEvent.text)} onChangeText={setTalentTypeQuery} style={styles.searchInput} placeholderTextColor={theme.colors.borderGray} placeholder="Search Talent Role" />
															</View>
															<Animated.ScrollView style={[styles.dropdownItems, { height: 5 * 57 }]}>
																{filteredData?.map((item: any, index: number) => (
																	<TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleProfessionSelect(item)}>
																		<Text size="bodyMid" color="regular">
																			{item.name}
																		</Text>
																	</TouchableOpacity>
																))}
															</Animated.ScrollView>
														</View>
													</SafeAreaView>
												</Pressable>
											</Modal>
										) : null}
									</View>
								</FormControl>
								{talentTypeQuery && Keyboard.isVisible() ? null : <FormMessage />}
							</FormItem>
						)}
					/>
					{!state.talent_selection_details.project_invitations.length ? (
						<View style={{ flex: 1, zIndex: -9, backgroundColor: theme.colors.backgroundDarkBlack }}>
							<Text size="primaryMid" color="regular" style={{ padding: theme.padding.base }}>
								Suggestions
							</Text>
							<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: theme.padding.base }}>
								{ProjectStorage.getString('search-history-0') || ProjectStorage.getString('search-history-1') || ProjectStorage.getString('search-history-2') || ProjectStorage.getString('search-history-3') ? null : (
									<Text size="button" color="muted" textAlign="center" style={{ paddingVertical: theme.padding.sm }}>
										No suggestions available
									</Text>
								)}
								<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
									{ProjectStorage.getString('search-history-3') ? (
										<Pressable onPress={() => handleSuggestionClick(3)} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
											<Timer size="24" color={theme.colors.typography} />
											<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
												{ProjectStorage.getString('search-history-3')}
											</Text>
										</Pressable>
									) : null}
									{ProjectStorage.getString('search-history-2') ? (
										<Pressable onPress={() => handleSuggestionClick(2)} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
											<Timer size="24" color={theme.colors.typography} />
											<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
												{ProjectStorage.getString('search-history-2')}
											</Text>
										</Pressable>
									) : null}
								</View>
								<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
									{ProjectStorage.getString('search-history-1') ? (
										<Pressable onPress={() => handleSuggestionClick(1)} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
											<Timer size="24" color={theme.colors.typography} />
											<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
												{ProjectStorage.getString('search-history-1')}
											</Text>
										</Pressable>
									) : null}
									{ProjectStorage.getString('search-history-0') ? (
										<Pressable onPress={() => handleSuggestionClick(0)} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
											<Timer size="24" color={theme.colors.typography} />
											<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
												{ProjectStorage.getString('search-history-0')}
											</Text>
										</Pressable>
									) : null}
								</View>
							</View>
						</View>
					) : (
						<View>
							{state.talent_selection_details.project_invitations.map((item, index) => (
								<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
									<Accordion
										customStyles={styles.accordion}
										title={
											<View style={{ flexDirection: 'row', gap: theme.gap.sm, justifyContent: 'center', alignItems: 'center' }}>
												<RNText style={{ color: theme.colors.success, fontFamily: theme.fontFamily.cgBold, fontSize: theme.fontSize.secondary }}>{String(item.talent_ids?.length || 0).padStart(2, '0')}</RNText>
												<Text size="secondary" color="regular">
													{item.profession_id.name}
												</Text>
												<Pressable style={{ padding: theme.padding.xs }} onPress={() => handleDateSelect(item.profession_id)}>
													<Calendar size="24" strokeWidth={3} color="none" strokeColor={theme.colors.typography} />
												</Pressable>
											</View>
										}>
										<Pressable onPress={() => onAddPress(item)}>
											<View style={styles.accordionContentHeader}>
												<AddCircled color={theme.colors.borderGray} size="24" />
												<Text size="cardSubHeading" style={styles.accordionText} color="muted">
													Add More {item.profession_id.name}s
												</Text>
											</View>
										</Pressable>
										<FlashList data={item.talent_ids || []} estimatedItemSize={100} renderItem={({ item: it }) => renderUserItem(item?.profession_id, it)} keyExtractor={item => item.id} />
									</Accordion>
								</View>
							))}
						</View>
					)}
				</Animated.ScrollView>
				{/* selectedProfession.value ? <CalendarModal onDismiss={handleCalendarDismiss} value={{ profession: selectedProfession.value!, dates: selectedDates }} onChange={handleSetDate} /> : null*/}
				{showGuide && <SelectionGuide onDismiss={() => setShowGuide(false)} />}

				<View style={{ flexDirection: 'row', position: 'absolute', backgroundColor: theme.colors.backgroundDarkBlack, bottom: 16, zIndex: 999, right: 0, left: 0, padding: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<Button onPress={handleDone} type="secondary" textColor="regular" style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						Done
					</Button>
					<Button onPress={handleHireLocation} style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						Hire Location
					</Button>
				</View>
			</Form>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		zIndex: 1,
	},
	talentContainer: (index: number) => ({
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderColor: theme.colors.borderGray,
		borderTopWidth: index === 0 ? theme.borderWidth.slim : 0,
		borderBottomWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
	}),
	professionContainer: {
		flexDirection: 'row',
		// gap: theme.gap.xxxs,
	},
	profileContainer: {
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	profileImage: {
		width: '100%',
		height: '100%',
	},
	talentInfoContainer: {
		flex: 1,
		gap: theme.gap.xxxs,
		padding: theme.padding.base,
	},
	actionsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginRight: theme.margins.base,
	},
	bookmarkIcon: {
		marginRight: theme.margins.base,
	},
	accordionContainer: {
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
	},
	accordion: {
		borderBottomWidth: 0,
		flex: 1,
	},
	accordionContentHeader: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	accordionText: {
		fontStyle: 'italic',
	},
	buttonElement: {
		backgroundColor: theme.colors.destructive,
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 1,
		zIndex: -9,
	},
	textInput: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	listContainer: {
		marginTop: theme.margins.xxl,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	searchContainer: {
		zIndex: 9,
		justifyContent: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
	},
	searchInput: {
		borderWidth: 0,
		marginLeft: 1.5 * theme.margins.base,
		padding: theme.padding.base,
		color: theme.colors.typography,
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
		left: theme.padding.base / 2,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	dropdownItems: {
		zIndex: 999,
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
