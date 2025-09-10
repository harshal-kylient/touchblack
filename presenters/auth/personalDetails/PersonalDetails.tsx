/* eslint-disable */
import { View, Text, StatusBar, SafeAreaView, Dimensions, ActivityIndicator, Keyboard, Alert, Platform, TouchableOpacity } from 'react-native';
import { FieldError, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useEffect, useState } from 'react';

import { Pencil, Person } from '@touchblack/icons';
import { Avatar, Button, FileInput, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Tag, TextInput } from '@touchblack/ui';

import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import FormSchema from './schema';
import * as z from 'zod';
import Asterisk from '@components/Asterisk';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '@components/Header';
import { DocumentPickerResponse } from '@react-native-documents/picker';
import useGetProfessions from '@network/useGetProfessions';
import jsonToFormdata from '@utils/jsonToFormData';
import { useAuth } from '../AuthContext';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { useQueryClient } from '@tanstack/react-query';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import AutoComplete from '@components/AutoComplete';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import SearchInput from '@components/SearchInput';

const width = Dimensions.get('window').width;

function PersonalDetails({ navigation }: any) {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, userId, producerId, setAuthInfo } = useAuth();
	const { data } = useGetTalentDetails(userId!);
	const firstName = data?.data?.first_name;
	const lastName = data?.data?.last_name;
	const talentPictureUrl = data?.data?.profile_picture_url;
	const [serverError, setServerError] = useState('');
	const [message, setMessage] = useState('');
	const [selectedFile, setSelectedFile] = useState<Asset | null>(null);
	const { data: response, isLoading } = useGetProfessions();
	const allProfessions = response?.pages?.flatMap(page => page);
	const [professions, setProfessions] = useState(allProfessions);
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [bottomHeight, setBottomHeight] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const filteredProfessions = allProfessions?.filter(p => (searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true));


	const insets = useSafeAreaInsets();

	const queryClient = useQueryClient();

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			profile_picture: talentPictureUrl,
			first_name: firstName,
			last_name: lastName,
			profession_id: null,
		},
	});

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

	async function handleFile() {
		try {
			const result = await launchImageLibrary({
				presentationStyle: 'fullScreen',
				mediaType: 'photo',
				selectionLimit: 1,
			});

			const file = result.assets?.[0];
			const filename = file?.fileName?.toLowerCase();

			if (!file || !filename) return;

			if (filename.endsWith('.heif') || filename.endsWith('.heic')) {
				setMessage('Only .png, .jpg, .jpeg file types are supported');
				return;
			}

			setSelectedFile(file);
			// @ts-ignore
			form.setValue('profile_picture', file);
		} catch (error) {
			console.warn('Image selection error:', error);
		}
	}

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		const { profile_picture } = data;
		const isProducer = loginType === 'producer';

		if (profile_picture && selectedFile) {
			let profilepic_url = CONSTANTS.endpoints.talent_profilepic;
			if (isProducer) {
				profilepic_url = CONSTANTS.endpoints.producer_profilepic;
			}

			const formData = new FormData();
			formData.append('profile_picture', {
				uri: selectedFile.uri,
				type: selectedFile.type,
				name: selectedFile.fileName,
			});

			try {
				const pic_response = await server.post(profilepic_url, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				if (pic_response.data?.success) {
					if (!isProducer) {
						try {
							const response = await server.get(CONSTANTS.endpoints.talent_about(userId!));
							if (response.data?.success) {
								queryClient.invalidateQueries(['useGetUserDetailsById', 'User', userId!]);
							}
						} catch (error) {}
					} else if (isProducer) {
						try {
							const response = await server.get(CONSTANTS.endpoints.producer_about(producerId!));
							if (response.data?.success) {
								queryClient.invalidateQueries(['useGetUserDetailsById', 'Producer', producerId!]);
							}
						} catch (error) {}
					}
				}
			} catch (error) {
				setServerError('Failed to upload profile picture');
			}
		}

		try {
			const payload = jsonToFormdata(data);
			const profile_response = await server.post(CONSTANTS.endpoints.update_talent_profile, payload, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (profile_response.data?.success) {
				const professionName = data.profession_id?.name?.toLowerCase();
				const userType = professionName === 'studio user' ? 'studio' : professionName === 'producer' ? 'producer' : professionName === 'talent manager' ? 'manager' : 'talent';
				setAuthInfo({
					loginType: userType,
				});
				queryClient.invalidateQueries({ queryKey: ['useGetUserDetailsById', 'User', userId!] });
				if (userType === 'studio') {
					navigation.reset({
						index: 0,
						routes: [{ name: 'StudioWelcome' }],
					});
				} else if (userType === 'manager') {
					navigation.reset({
						index: 0,
						routes: [
							{
								name: 'WelcomeManager',
								params: {
									managerName: data?.first_name,
								},
							},
						],
					});
				} else {
					navigation.reset({
						index: 0,
						routes: [{ name: 'TabNavigator' }],
					});
				}
			}
		} catch (error) {
			setServerError('Failed to update profile');
		}
	}

	if (isLoading) {
		return <ActivityIndicator size="small" color={theme.colors.primary} style={{ backgroundColor: theme.colors.black, flex: 1 }} />;
	}

	function onSearch(query: string) {
		const data = allProfessions?.filter(it => it.name.toLowerCase().includes(query.toLowerCase()));
		setProfessions(data);
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
		<SafeAreaView style={[styles.container]}>
			<Header onLayout={handleLayout} name="Personal Details" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<ScrollView
					style={{ gap: theme.gap.base }}
					ref={ref => {
						this.scrollView = ref;
					}}
					onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}>
					<View style={styles.imageContainer}>
						<View style={styles.image}>
							{form.watch('profile_picture') ? (
								//convert the image to absolute path
								<Avatar style={styles.fillLayout} source={selectedFile} />
							) : (
								<Person size="90" color={theme.colors.borderGray} />
							)}
						</View>
						<View style={styles.fileInputContainer}>
							<TouchableOpacity onPress={() => handleFile()} style={styles.fileInput}>
								<Pencil color={theme.colors.primary} size={`${(width - 265) / 4}`} />
							</TouchableOpacity>
							<View style={styles.blankView} />
						</View>
					</View>

					{message ? (
						<Text color="error" textAlign="center" size="bodyMid" style={{ paddingVertical: theme.padding.xxs, backgroundColor: theme.colors.black, minWidth: '100%' }}>
							{message}
						</Text>
					) : null}
					<View style={styles.formContainer}>
						<Form {...form}>
							<FormField
								control={form.control}
								name="first_name"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											First Name (as per Aadhar)
											<Asterisk />
										</FormLabel>
										<FormControl>
											<TextInput
												value={field.value}
												onChangeText={v => {
													setServerError('');
													field.onChange(v);
												}}
												keyboardType="default"
												placeholder=""
												placeholderTextColor={theme.colors.typographyLight}
												maxLength={30}
												style={styles.textinput(serverError || form.formState.errors.first_name)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="last_name"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Last Name (as per Aadhar) <Asterisk />
										</FormLabel>
										<FormControl>
											<TextInput
												value={field.value}
												onChangeText={v => {
													setServerError('');
													field.onChange(v);
												}}
												keyboardType="default"
												placeholder=""
												placeholderTextColor={theme.colors.typographyLight}
												maxLength={30}
												style={styles.textinput(serverError || form.formState.errors.first_name)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="profession_id"
								rules={{ required: true }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											Profession Type <Asterisk />
										</FormLabel>
										<FormControl>
											<View>
												<SearchInput placeholderText="Search profession" onSubmitEditing={() => setModalVisible(false)} autoFocus={false} searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />

												{modalVisible && (
													<ScrollView style={styles.searchResultsContainer}>
														{filteredProfessions?.map(profession => (
															<TouchableOpacity
																key={profession.id}
																activeOpacity={0.9}
																onPress={() => {
																	field.onChange(profession);
																	setModalVisible(false);
																	setSearchQuery('');
																}}
																style={styles.searchResultItem}>
																<Text style={styles.dropdownText}>{profession.name}</Text>
															</TouchableOpacity>
														))}
													</ScrollView>
												)}
											</View>

											{field?.value && (
												<View style={{ marginTop: theme.margins.xxxs }}>
													<Tag key={field.value.id} label={field.value.name} onPress={() => field.onChange(null)} type={'actionable' as TagTypes} />
												</View>
											)}
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</Form>
					</View>
				</ScrollView>
				<View onLayout={handleLayout2}>
					<Text style={styles.errorText(serverError)}>{serverError}</Text>
					<View style={[styles.cta, { paddingTop: theme.padding.base, paddingBottom: Platform.OS === 'ios' && screenHeight === CONSTANTS.screenHeight ? 0 : theme.padding.base }]}>
						<Button
							onPress={() => {
								form.handleSubmit(onSubmit)();
							}}>
							Continue
						</Button>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default PersonalDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		fontFamily: 'CabinetGrotesk-Regular',
		paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 0,
	},
	searchResultsContainer: {
		width: '100%',
		marginTop: -2,
		maxHeight: 200,
	},

	searchInput: {
		width: '110%',
		marginHorizontal: -20,
	},
	searchResultItem: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownText: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	imageContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	image: {
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		aspectRatio: 1,
		width: 265,
	},
	fillLayout: { width: '100%', height: '100%' },
	fileInputContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
		position: 'absolute',
		bottom: 0,
		right: 0,
		flexDirection: 'row',
	},
	fileInput: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: theme.colors.transparent,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	blankView: {
		width: (width - 265) / 4,
		height: (width - 265) / 4,
	},
	formContainer: { paddingHorizontal: 16, gap: 32, marginTop: 24 },
	errorText: (error: string | undefined) => ({
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: error ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	paragraph: {
		color: theme.colors.typographyLight,
		fontSize: theme.fontSize.typographyLg,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	heading: {
		fontSize: theme.fontSize.primaryH2,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	textinput: (error: string | FieldError | undefined) => ({
		flexGrow: 1,
		paddingHorizontal: 10,
		borderColor: error ? theme.colors.destructive : theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
	}),
	cta: {
		paddingHorizontal: theme.padding.base,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
}));
