import { Keyboard, SafeAreaView, ScrollView, TextInput as RNTextInput, TouchableOpacity, View, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Tag, Text, TextInput } from '@touchblack/ui';
import * as z from 'zod';

import Asterisk from '@components/Asterisk';
import { Delete, ErrorFilled, FileUpload } from '@touchblack/icons';
import { FormSchema1 } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from '@components/Select';
import useGetFilmTypes from '@network/useGetFilmTypes';
import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from '@touchblack/icons';
import useGetBrands from '@network/useGetBrands';
import useGetDistricts from '@network/useGetDistricts';
import capitalized from '@utils/capitalized';
import { pick, types } from '@react-native-documents/picker';
import Header from '@components/Header';
import { StackActions, useNavigation } from '@react-navigation/native';
import CONSTANTS from '@constants/constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AutoComplete from '@components/AutoComplete';
import { useAuth } from '@presenters/auth/AuthContext';
import server from '@utils/axios';
import { useProjectsContext } from '../ProjectContext';
import { useStudioBookingContext } from '@presenters/studio/booking/StudioContext';
import { useQueryClient } from '@tanstack/react-query';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

export default function CreateProjectStep1() {
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useProjectsContext();
	const { state: studioState, dispatch: studioDispatch } = useStudioBookingContext();
	const { data: response1, isLoading: isFilmTypeLoading, isError: isFilmTypeError } = useGetFilmTypes();
	const filmTypes = response1?.pages?.flatMap(page => page) || [];
	const [brandQuery, setBrandQuery] = useState('');
	const { data: response2, isLoading: isBrandLoading, isError: isBrandError } = useGetBrands(brandQuery);
	const brands = response2?.pages?.flatMap(page => page?.results) || [];
	const [locationQuery, setLocationQuery] = useState('');
	const { data: response3, isLoading: isDistrictLoading, isError: isDistrictError } = useGetDistricts(capitalized(locationQuery));
	const locations = response3?.pages?.flatMap(page => page?.results) || [];
	const locationInputRef = useRef<RNTextInput>(null);
	const navigation = useNavigation();
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const { producerId } = useAuth();
	const queryClient = useQueryClient();
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

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	const handleLayout2 = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setBottomHeight(height);
	};

	const form = useForm<z.infer<typeof FormSchema1>>({
		resolver: zodResolver(FormSchema1),
		defaultValues: {
			video_type_id: { id: '', name: '' },
			brand_id: { id: '', name: '' },
			project_name: '',
			film_brief: '',
			film_brief_attachment: null,
			location_ids: [],
		},
	});

	async function handleFileInput(onChange: (event: any) => void) {
		try {
			const file = await pick({
				presentationStyle: 'fullScreen',
				type: [types.pdf, types.plainText],
			});

			onChange(file);
		} catch (err: unknown) {}
	}

	function createProjectTransformer(data: z.infer<typeof FormSchema1>) {
		const formdata = new FormData();
		formdata.append('producer_id', producerId);
		formdata.append('video_type_id', data.video_type_id?.id);
		formdata.append('brand_id', data.brand_id?.id);
		formdata.append('project_name', data.project_name);
		formdata.append('film_brief', data.film_brief);
		data.location_ids.forEach(it => {
			formdata.append('location_ids[]', it.id);
		});
		if (data.film_brief_attachment?.uri) {
			formdata.append('film_brief_attachment', {
				uri: data.film_brief_attachment?.uri,
				type: data.film_brief_attachment?.type,
				name: data.film_brief_attachment?.name,
			});
		}

		return formdata;
	}

	async function onSubmit(data: z.infer<typeof FormSchema1>) {
		try {
			const response = await server.postForm(CONSTANTS.endpoints.project, createProjectTransformer(data));
			const success = String(response.status).startsWith('2');

			if (!success) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.ProjectCreationPopup,
						data: {
							isSuccess: false,
							header: "Project Couldn't be Created",
							text: response.data?.message || 'Something went wrong. Please try again.',
							successText: 'Retry',
							dismissText: 'Cancel',
						},
						onSheetClose: () => {
							navigation.goBack();
						},
					},
				});
			} else {
				// Update contexts and queries
				queryClient.invalidateQueries(['useGetProducerProjects', EnumProducerStatus.Live, undefined]);
				dispatch({ type: 'PROJECT_ID', value: response.data?.data?.project_id });
				dispatch({ type: 'PROJECT_NAME', value: response.data?.data?.project_name });
				dispatch({ type: 'VIDEO_TYPE', value: data.video_type_id });
				studioDispatch({
					type: 'PROJECT_ID',
					value: {
						id: response.data?.data?.project_id,
						name: response.data?.data?.project_name,
						video_type: data.video_type_id,
					},
				});

				// Show success popup
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.ProjectCreationPopup,
						data: {
							isSuccess: true,
							header: 'Project Created Successfully!',
							text: "Your project is almost ready to take off! You've successfully created your project, but there's still more to bring your vision to life. To complete your project, make sure to Hire Talent and Hire Location. You can take the next step now or close this for later – it's all up to you!",
							successText: 'Hire Talent',
							dismissText: 'Hire Location',
						},
					},
					
				});
			}
		} catch (err) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.ProjectCreationPopup,
					data: {
						isSuccess: false,
						header: 'Network Error',
						text: 'Please check your connection and try again.',
						successText: 'Retry',
						dismissText: 'Cancel',
					},
					onSheetClose: () => {
						navigation.goBack();
					},
				},
			});
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Project Creation" />
			
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<Form {...form}>
					<ScrollView
						style={styles.container}
						contentContainerStyle={{
							justifyContent: 'space-between',
							gap: theme.gap.xxl,
							backgroundColor: theme.colors.backgroundDarkBlack,
							paddingBottom: 96,
							transform: [{ translateY: locationQuery && locationInputRef.current?.isFocused() ? -54 * 3 : 0 }],
						}}>
						<FormField
							control={form.control}
							name="video_type_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Film Type <Asterisk />
									</FormLabel>
									<FormControl>
										<Select itemsToShow={5} value={field.value} onChange={field.onChange} items={filmTypes} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="brand_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Brand Name</FormLabel>
									<FormControl>
										<View style={styles.searchInputContainer}>
											<AutoComplete
												placeholder="Select brand name"
												value={field.value}
												onChange={item => {
													field.onChange({ id: item?.id, name: item?.name });
													setBrandQuery('');
												}}
												onSearch={setBrandQuery}
												itemsToShow={3}
												items={brands}
											/>
										</View>
									</FormControl>
									{brandQuery && Keyboard.isVisible() ? null : <FormMessage />}
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="project_name"
							render={({ field }) => (
								<FormItem style={{ zIndex: -9 }}>
									<FormLabel>
										Project Name <Asterisk />
									</FormLabel>
									<FormControl>
										<TextInput placeholder="Project Name" placeholderTextColor={theme.colors.borderGray} style={styles.textInput} onChangeText={field.onChange} value={field.value} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location_ids"
							render={({ field }) => (
								<FormItem style={{ zIndex: -9 }}>
									<FormLabel>
										Location <Asterisk />
									</FormLabel>
									<FormControl>
										<View style={styles.searchInputContainer}>
											<View style={styles.searchContainer}>
												<SearchIcon style={styles.searchIcon} color="white" size="20" />
												<TextInput value={locationQuery} ref={locationInputRef} onSubmitEditing={e => setLocationQuery(e.nativeEvent.text)} onChangeText={setLocationQuery} style={styles.searchInput} placeholderTextColor={theme.colors.borderGray} placeholder="Search location" />
											</View>
											{field.value?.map(it => (
												<Tag
													label={it.name}
													onPress={() => {
														const value = field.value?.filter(item => item.id !== it.id);
														field.onChange(value);
													}}
													type="actionable"
												/>
											))}
											{locationQuery ? (
												<ScrollView style={[styles.dropdownItems, { height: Math.min(3, locations.length || 1) * 57 }]}>
													{locations?.map((item: any, index: number) => (
														<TouchableOpacity
															key={item?.id}
															style={styles.dropdownItem}
															onPress={() => {
																const value = field.value ? [...field.value, { id: item.id, name: item.name }] : [{ id: item.id, name: item.name }];
																field.onChange(value);
																setLocationQuery('');
															}}>
															<Text size="bodyMid" color="regular">
																{item.name}
															</Text>
														</TouchableOpacity>
													))}
													{!locations?.length && (
														<View style={{ flex: 1, paddingTop: theme.padding.base, justifyContent: 'center', alignItems: 'center' }}>
															<Text size="bodyBig" color="muted">
																No locations found
															</Text>
														</View>
													)}
												</ScrollView>
											) : null}
										</View>
									</FormControl>
									{locationQuery && Keyboard.isVisible() ? null : <FormMessage />}
								</FormItem>
							)}
						/>
						<View style={{ flexDirection: 'row', zIndex: -19, gap: theme.gap.xs, flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
							<FormField
								control={form.control}
								name="film_brief"
								render={({ field }) => (
									<FormItem style={{ zIndex: -19, flex: 1 }}>
										<FormLabel>Film Brief (optional) (Max 20Mb)</FormLabel>
										<FormControl style={{ flexDirection: 'row', alignItems: 'center' }}>
											<TextInput placeholder="Write a brief or upload a note..." placeholderTextColor={theme.colors.borderGray} style={styles.textInput} onChangeText={value => field.onChange(value)} value={field.value} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="film_brief_attachment"
								render={({ field }) => (
									<FormItem style={{ zIndex: -19 }}>
										<FormLabel></FormLabel>
										<FormControl style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Pressable onPress={() => handleFileInput(field.onChange)} style={{ alignContent: 'center', paddingVertical: theme.padding.sm, paddingHorizontal: theme.padding.base, minHeight: 55, backgroundColor: theme.colors.backgroundLightBlack, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'center' }}>
												<FileUpload strokeWidth={2} size={'24'} color={theme.colors.typography} />
											</Pressable>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</View>
						{form.watch('film_brief_attachment') ? (
							<View style={{ flexDirection: 'row', zIndex: -99, justifyContent: 'space-between', alignItems: 'center', padding: theme.padding.base, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
								<Text numberOfLines={1} style={{ maxWidth: '90%',  }} color="muted" size="bodyBig">
									{capitalized(form.watch('film_brief_attachment')[0]?.name)}
								</Text>
								<Pressable onPress={() => form.setValue('film_brief_attachment', null)}>
									<Delete color={theme.colors.muted} size="24" />
								</Pressable>
							</View>
						) : null}
					</ScrollView>
					<View style={{ position: 'absolute', bottom: 0, zIndex: 999999, right: 0, left: 0, padding: theme.padding.base, paddingBottom: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, backgroundColor: theme.colors.backgroundDarkBlack }}>
						<Button onPress={form.handleSubmit(onSubmit)}>Create</Button>
					</View>
				</Form>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		zIndex: 1,
		paddingHorizontal: theme.padding.base,
	},
	textInput: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		minHeight: 55,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
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
		left: (3 * theme.padding.base) / 5,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	dropdownItems: {
		position: 'absolute',
		top: 54,
		left: 0,
		right: 0,
		zIndex: 999999,
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
