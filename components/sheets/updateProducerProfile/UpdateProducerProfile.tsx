import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormSchema1, FormSchema2 } from './schema';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Text, TextInput } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Select from '@components/Select';
import { Keyboard, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import Header from '@components/Header';
import { Delete } from '@touchblack/icons';
import useGetAwards from '@network/useGetAwards';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetProducerFilms from '@network/useGetProducerFilms';
import { useEffect, useRef, useState } from 'react';
import useGetDistricts from '@network/useGetDistricts';
import * as z from 'zod';
import { darkTheme } from '@touchblack/ui/theme';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import contactSupport from '@utils/contactSupport';
import cloneDeep from 'lodash.clonedeep';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import useGetProducerAwards from '@network/useGetProducerAwards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UpdateProducerProfile() {
	const { styles, theme } = useStyles(stylesheet);
	const [message, setMessage] = useState({ msg: '', success: false });
	const { data: response2, isLoading: isAwardsLoading, isError: isAwardsError } = useGetAwards();
	const awards = response2?.pages?.flatMap(page => page).map(it => ({ id: it.id, name: it.name })) || [];
	const { producerId } = useAuth();
	const [screenHeight, setScreenHeight] = useState(CONSTANTS.screenHeight);
	const [headerHeight, setHeaderHeight] = useState(0);

	const insets = useSafeAreaInsets();

	const { data: response4 } = useGetProducerFilms(producerId!);
	const producerFilms = response4?.pages?.flatMap(page => page?.data).map(it => ({ id: it.film_id, name: it.film_name })) || [];
	const { data } = useGetUserDetailsById('Producer', producerId!);

	const locationInputRef = useRef(null);
	const [bottomMargin, setBottomMargin] = useState(0);
	const [locationQuery, setLocationQuery] = useState('');
	const { data: response3, isLoading: isDistrictsLoading, isError: isDistrictsError } = useGetDistricts(locationQuery);
	const districts = response3?.pages?.flatMap(page => page?.results).map(it => ({ id: it.id, name: it.name, state_id: it.state_id })) || [];
	const queryClient = useQueryClient();
	const { data: response } = useGetProducerAwards(producerId!);
	const myawards = response?.data;

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
			district_id: {
				id: data?.district_id || '',
				name: data?.locations || '',
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

	async function handleDeleteAward(index: number) {
		const x = async () => {
			const state = cloneDeep(form2.watch('awards'));
			if (!state[index].owner_award_id) {
				state.splice(index, 1);
				form2.setValue('awards', state);
				SheetManager.hide('Drawer');
				return;
			}

			const res = await server.post(CONSTANTS.endpoints.remove_producer_award, { owner_award_id: state[index].owner_award_id });
			if (res.data?.success) {
				state.splice(index, 1);
				form2.setValue('awards', state);
				queryClient.invalidateQueries(['useGetProducerAwards', producerId]);
				SheetManager.hide('Drawer');
			}
			return res;
		};

		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.Delete, data: { text: 'Are you sure to delete this award entry?', header: 'Delete Award', onDismiss: () => SheetManager.hide('Drawer'), onDelete: x } },
		});
	}

	async function onSubmit1(data: z.infer<typeof FormSchema1>) {
		const res1 = await server.post(CONSTANTS.endpoints.update_producer_bio, { bio: data.bio || '' });
		queryClient.invalidateQueries(['useGetUserDetailsById', 'Producer', producerId]);
		setMessage({ msg: res1.data?.message, success: res1.data?.success });
	}

	async function onSubmit2(data: z.infer<typeof FormSchema2>) {
		const formdata = { awards: data.awards.map(it => ({ owner_award_id: it.owner_award_id, award_id: it.award_id.id, film_id: it.film_id.id, year_of_award: Number(it.year_of_award) })) };
		const res = await server.post(CONSTANTS.endpoints.update_producer_award, formdata);

		queryClient.invalidateQueries(['useGetProducerAwards', producerId]);
		setMessage({ msg: res.data?.message, success: res.data?.success });
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header onLayout={handleLayout} name="Edit Producer Profile" />
			<View style={{ flex: 1, justifyContent: 'space-between', maxHeight: screenHeight }}>
				<ScrollView bounces={false} style={{ paddingHorizontal: theme.padding.base }} contentContainerStyle={{ paddingBottom: 80, gap: theme.gap.base, backgroundColor: theme.colors.backgroundDarkBlack }}>
					<Form {...form1}>
						<Text size="primaryMid" color="regular">
							Basic details
						</Text>
						<FormField
							name="bio"
							control={form1.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<TextInput style={styles.textinput} multiline={true} value={field.value} onChangeText={field.onChange} placeholder="Enter Your Bio" placeholderTextColor={theme.colors.typographyLight} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button onPress={form1.handleSubmit(onSubmit1)}>Update</Button>
						<Text color="muted" size="bodyMid">
							Note: for more advanced edits contact our support team at{' '}
							<Text onPress={contactSupport} color="primary" size="bodyMid">
								Cs@talentgridnow.com
							</Text>
						</Text>
					</Form>
					<Form {...form2}>
						<Text size="primaryMid" color="regular">
							Awards
						</Text>
						<FormField
							control={form2.control}
							name="awards"
							render={({ field }) => {
								return field.value.map((it, index) => {
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
											<Select items={producerFilms} itemsToShow={5} onChange={value => handleFilmSelect(index, value)} value={it.film_id} placeholder="Select film for the award" />
											<TextInput style={styles.textinput} value={it.year_of_award} placeholder="Enter year of award" onChangeText={value => handleYearChange(index, value)} keyboardType="numeric" maxLength={4} />
										</View>
									);
								});
							}}
						/>
						<Pressable onPress={handleAddAward}>
							<Text size="bodyBig" color="primary">
								Add Award
							</Text>
						</Pressable>
						{<Button onPress={form2.handleSubmit(onSubmit2)}>Update Awards</Button>}
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
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		color: theme.colors.typography,
		fontSize: theme.fontSize.title,
		fontFamily: 'CabinetGrotesk-Regular',
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
