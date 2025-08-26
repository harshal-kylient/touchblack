/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, ScrollView, StatusBar, TextInput as RNTextInput, View, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { z } from 'zod';
import { FlashList } from '@shopify/flash-list';
import CheckBox from '@components/Checkbox';
import { SheetManager } from 'react-native-actions-sheet';
import { zodResolver } from '@hookform/resolvers/zod';

import CONSTANTS from '@constants/constants';
import { IMainStackParams } from '@presenters/index';
import FilmThumbnailItem from '@presenters/blackBook/FilmThumbnailItemForBlackBook';
import useGetFilmsOfTalentAsCrew from '@network/useGetFilmsOfTalentAsCrew';
import { useUnlikeBlackBookFilms } from '@network/useUnlikeBlackBookFilms';
import server from '@utils/axios';
import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import HeaderPlaceholder from '@components/loaders/HeaderPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import AddToBlackBookFormSchema from './AddToBlackBookSchema';
import { PrioritiesData, buildHeaderName, filterFilms, getLikedFilms, handleRadioPress } from './addToBlackBookUtils';
import { SheetType } from 'sheets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IAddToBlackBookProps {
	route: RouteProp<IDrawerParamList, 'AddToBlackBook'>;
	navigation: DrawerNavigationProp<IDrawerParamList, 'AddToBlackBook'> & NativeStackNavigationProp<IMainStackParams>;
}

function AddToBlackBook({ route,  }: IAddToBlackBookProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [serverError, setServerError] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { talentData } = route.params;
	const navigation = useNavigation()
	const scrollRef = useRef<ScrollView>(null);
	const { rating, notes, bookmark_id, blackbook_id, bookmark_name, id, user_id, films, first_name, last_name, profession_type } = talentData;
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);

	const insets = useSafeAreaInsets();

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
	// id is needed for workedWith section talents
	// user_id is needed for the talent details page
	// bookmark_id is needed for the blackbook page
	const talentId = user_id || bookmark_id || id;

	const { data: talentFilms, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetFilmsOfTalentAsCrew(talentId);
	const flattenedTalentFilms = talentFilms?.pages.flatMap(page => page?.data) || [];

	const likedFilmIds = getLikedFilms(films);
	const [selectedFilmIds, setSelectedFilmIds] = useState<string[]>(likedFilmIds);
	const unlikeMutation = useUnlikeBlackBookFilms();

	function handleInputChange(text: string, field: any) {
		setServerError('');
		field.onChange(text);
	}

	const queryClient = useQueryClient();
	const form = useForm({
		resolver: zodResolver(AddToBlackBookFormSchema),
		defaultValues: {
			bookmark_id: talentId,
			film_ids: likedFilmIds,
			rating: rating || '',
			notes: notes || '',
		},
	});

	const handleCheckBoxPress = (filmId: string, isChecked: boolean, field: ControllerRenderProps<{ bookmark_id: any; film_ids: string[]; rating: any; notes: any }, 'film_ids'>) => {
		const newFilmIds = isChecked ? selectedFilmIds.filter((newFilmId: string) => newFilmId !== filmId) : [...selectedFilmIds, filmId];
		setSelectedFilmIds(newFilmIds);
		field.onChange(newFilmIds);
	};

	useFocusEffect(
		useCallback(() => {
			setSelectedFilmIds(likedFilmIds);
			form.reset({
				bookmark_id: bookmark_id || talentId,
				film_ids: likedFilmIds,
				rating: rating || '',
				notes: notes || '',
			});
		}, [talentData, form, films]),
	);

	const addToBlackBookMutation = useMutation({
		mutationFn: (data: z.infer<typeof AddToBlackBookFormSchema>) => server.post(CONSTANTS.endpoints.add_blackbook, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetBookmarkedFilms', talentData.blackbook_id] });
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: bookmark_id ? 'Your favorites profile updated' : 'Added to My favorites',
						text: bookmark_id ? `${bookmark_name}'s favorites profile is successfully updated.` : `${first_name} ${last_name} is successfully added to My favorites.`,
						onPress: () => {
							form.reset({
								bookmark_id: bookmark_id || talentId,
								film_ids: [],
								rating: '',
								notes: '',
							});

							queryClient.invalidateQueries({ queryKey: ['useGetUserDetailsById', 'User', user_id] });
							navigation.goBack();
						},
					},
				},
			});
		},
		onError: (error: any) => {
			setServerError('Failed to add to My favorites: ' + error.message);
		},
	});

	const handleFormErrors = () => {
		if (!form.watch('notes')) {
			scrollRef.current?.scrollToEnd();
		}
	};

	const handleAddToBlackBookSubmit = async (data: z.infer<typeof AddToBlackBookFormSchema>) => {
		try {
			setServerError('');
			const filmsToRemove = likedFilmIds.filter(filmIdToRemove => !selectedFilmIds.includes(filmIdToRemove));
			// const filmsToAdd = selectedFilmIds.filter(id => !likedFilmIds.includes(id));

			if (filmsToRemove.length > 0) {
				unlikeMutation.mutate({ blackbook_id: blackbook_id, film_ids: filmsToRemove, film_name: '' });
			}
			addToBlackBookMutation.mutate(data);
		} catch (error: any) {
			setServerError('Failed to add to My favorites' + error.message);
		}
	};

	const filteredFilms = filterFilms(flattenedTalentFilms, searchQuery);

	if (isLoading) {
		return (
			<View style={styles.loader}>
				<HeaderPlaceholder />
				<TextPlaceholder customWidth={220} customHeight={48} />
				<SearchBarPlaceholder />
				<LargeGridPlaceholder />
			</View>
		);
	}

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	const handleLayout2 = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setBottomHeight(height);
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header onLayout={handleLayout} name={bookmark_name ? buildHeaderName(bookmark_name) : buildHeaderName(first_name, last_name)} navigation={navigation} />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView ref={scrollRef} style={styles.addToBlackBookScreenContainer} contentContainerStyle={{ paddingBottom: 10 }}>
						<FormField
							control={form.control}
							name="film_ids"
							render={({ field }) => (
								<FormItem style={styles.formItem}>
									<FormLabel style={styles.formFieldLabel(true)}>Films you liked</FormLabel>
									<FormControl>
										<SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} containerStyles={styles.searchInput} placeholderText="Search by Film Name" />
										<View style={styles.filmsContainer}>
											<FlashList
												data={filteredFilms}
												renderItem={({ item }) => {
													const isChecked = selectedFilmIds.includes(item.film_id);
													return (
														<View style={styles.filmItemContainer}>
															<FilmThumbnailItem
																onPress={() => {
																	navigation.navigate('VideoPlayer', { id: item?.film_id });
																}}
																item={item}
																key={item.film_id}
															/>
															<View style={styles.checkboxContainer}>
																<CheckBox value={isChecked} onChange={() => handleCheckBoxPress(item.film_id, isChecked, field)} />
															</View>
														</View>
													);
												}}
												keyExtractor={item => item.film_id}
												estimatedItemSize={100}
												onEndReached={() => {
													if (hasNextPage && !isFetchingNextPage) {
														fetchNextPage();
													}
												}}
												onEndReachedThreshold={0.5}
												ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
											/>
										</View>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem style={styles.formItem}>
									<FormLabel style={styles.formFieldLabel(false)}>Priority score</FormLabel>
									<FormControl>
										<View style={styles.prioritiesContainer}>
											<View style={styles.marginContainer}>
												{PrioritiesData.map(priority => {
													return (
														<View key={priority.id} style={styles.priorityItemContainer} onTouchEnd={() => handleRadioPress(priority.name, field)}>
															<View style={styles.radioBorder(field.value, priority)}>{field.value === priority.name && <View style={styles.radio} />}</View>
															<Text size="bodyMid" color="regular" style={{ opacity: 0.8 }}>
																{priority.name}
															</Text>
														</View>
													);
												})}
											</View>
										</View>
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
					<View style={styles.buttonContainer}>
						<Button textColor="regular" type="secondary" style={styles.secondaryButton} onPress={() => navigation.goBack()}>
							Cancel
						</Button>
						<Button style={styles.button} onPress={form.handleSubmit(handleAddToBlackBookSubmit, handleFormErrors)}>
							Add
						</Button>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
}

export default AddToBlackBook;

const stylesheet = createStyleSheet(theme => ({
	safeArea: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	filmItemContainer: {
		height: 70,
		flexDirection: 'row',
		paddingLeft: theme.padding.base,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		justifyContent: 'center',
	},
	checkboxContainer: {
		paddingVertical: theme.padding.xl,
		paddingHorizontal: 10,
		position: 'absolute',
		flex: 1,
		right: 0,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	addToBlackBookScreenContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		marginBottom: 76, // height of bottom buttons
	},
	searchInput: {
		marginTop: 0,
		marginBottom: theme.margins.xxl,
	},
	filmsContainer: {
		// minHeight: 70 * 3, // 70 is the height of a film item
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		flexShrink: 1,
	},
	loader: {
		backgroundColor: theme.colors.black,
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
	radio: {
		backgroundColor: theme.colors.primary,
		width: 9,
		height: 9,
		borderRadius: 12,
	},
	radioBorder: (selectedId, priority) => ({
		borderColor: selectedId === priority.id ? theme.colors.primary : theme.colors.borderGray,
		borderWidth: 2,
		width: 19,
		height: 19,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	}),
	priorityItemContainer: {
		flexDirection: 'row',
		flex: 1,
		gap: theme.gap.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
	},
	prioritiesContainer: {
		flexDirection: 'row',
		borderBottomColor: 'rgba(255,255,255,0.7)',
		borderTopColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	marginContainer: {
		marginHorizontal: 16,
		flexDirection: 'row',
		flex: 1,
	},
	noteContainer: {
		flexDirection: 'row',
		borderBottomColor: theme.colors.borderGray,
		borderTopColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	noteTextArea: {
		backgroundColor: theme.colors.black,
		height: 80,
		width: '100%',
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
	},
	noteTextInput: error => ({
		borderColor: error ? theme.colors.destructive : theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	}),
	errorMessage: {
		paddingLeft: theme.padding.base,
		color: theme.colors.destructive,
		fontSize: theme.fontSize.typographyMd,
		marginTop: 4,
		fontFamily: theme.fontFamily.cgRegular,
	},
	formItem: {},
	formFieldLabel: (isFirstItem: boolean) => ({
		padding: theme.padding.base,
		paddingTop: isFirstItem ? 0 : theme.padding.base,
		fontFamily: theme.fontFamily.cgRegular,
		fontSize: theme.fontSize.secondary,
	}),
	buttonContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopColor: 'rgba(255,255,255,0.7)',
		borderTopWidth: theme.borderWidth.slim,
		position: 'absolute',
		bottom: 0,
	},
	button: {
		flex: 1,
	},
	secondaryButton: {
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
	},
	baseMargin: { marginHorizontal: theme.margins.base, marginTop: theme.margins.base },
}));
