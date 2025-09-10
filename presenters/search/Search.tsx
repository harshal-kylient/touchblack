import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, View, Pressable, TouchableOpacity, SafeAreaView, Keyboard, Platform, TextInput as RNTextInput, ActivityIndicator } from 'react-native';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Text, TextInput } from '@touchblack/ui';

import FilmSearches from '@components/search/FilmSearches';
import ProducerSearches from '@components/search/ProducerSearches';
import TalentSearches from '@components/search/TalentSearches';
import { Search as SearchIcon } from '@touchblack/icons';
import { SearchStorage } from '@utils/storage';
import capitalized from '@utils/capitalized';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useGetSearchResult from '@network/useGetSearchResult';
import CONSTANTS from '@constants/constants';
import transformTalentFilter from '@models/transformers/transformTalentFilter';
import RollingBar from 'react-native-rolling-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { usePostSearchCount } from '@network/usePostSearchCount';
import { useGetSubscriptionCurrentStatus } from '@network/useGetSubscriptionCurrentStatus';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

export enum SearchType {
	'TALENT' = 'USER',
	'FILM' = 'FILM',
	'PRODUCER' = 'PRODUCER',
}

export default function Search() {
	const { styles, theme } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState('');
	const navigation = useNavigation();
	const { state, dispatch } = useFilterContext();
	const { data: response } = useGetSearchResult(state.activeTab, searchQuery.toLowerCase().trim());
	const filters = transformTalentFilter(state.talentFilters);
	const { subscriptionData } = useSubscription();
	const { mutate: updateSearchCount } = usePostSearchCount();
	const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	const subscriptionPlan = subscriptionPlans?.data?.subscription_plans[0];
	const { data: subsCurrentStatus, refetch } = useGetSubscriptionCurrentStatus();
	const subscriptionStatus = subsCurrentStatus?.data?.subscription_status?.collated_status;
	const subscriptionId = subsCurrentStatus?.data?.subscription?.id;
	const restricted = response?.restricted;
	const searchesLeft = response?.searches_left;
	const data = useMemo(() => (state.activeTab === 0 ? response?.results?.map(it => ({ id: it?.id, name: (it?.first_name || '') + ' ' + (it?.last_name || '') })) || [] : state.activeTab === 1 ? response?.results?.map(it => ({ id: it?.film_id, name: it?.film_name })) || [] : response?.results?.map(it => ({ id: it?.id, name: it?.name })) || []), [state.activeTab, response]);
	const height = useSharedValue(0);
	useEffect(() => {
		if (searchesLeft < 1) {
			const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.SEARCH];
			if (restriction?.data?.popup_configuration) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.SubscriptionRestrictionPopup,
						data: restriction.data.popup_configuration,
					},
				});
			} else {
				return;
			}
		}
	}, [searchesLeft]);

	function handleTabSwitch(index: number) {
		dispatch({ type: 'TAB_CHANGE', value: index });
	}

	function handleSearch(query: string) {
		updateSearchCount();
		dispatch({ type: 'QUERY', value: query });
		if (!query) {
			return;
		}
		const alias = state.activeTab === 0 ? 'search-history-talents-' : state.activeTab === 1 ? 'search-history-films-' : 'search-history-producers-';
		const secondHistory = SearchStorage.getString(alias + '1');
		const thirdHistory = SearchStorage.getString(alias + '2');
		const fourthHistory = SearchStorage.getString(alias + '3');

		SearchStorage.set(alias + '0', secondHistory || '');
		SearchStorage.set(alias + '1', thirdHistory || '');
		SearchStorage.set(alias + '2', fourthHistory || '');
		SearchStorage.set(alias + '3', capitalized(query));
	}

	const handleSearchInputChange = (e: any) => {
		if (state.query) {
			dispatch({ type: 'QUERY', value: e.nativeEvent.text });
			setSearchQuery(e.nativeEvent.text);
		} else {
			setSearchQuery(e.nativeEvent.text);
		}
	};

	function handleSelect(item: any) {
		dispatch({ type: 'QUERY', value: item.name });
		handleSearch(item.name);
	}

	useEffect(() => {
		if (typeof data?.length === 'number') {
			height.value = data?.length > 5 ? 5 * 57 : data?.length * 57;
		}
	}, [height, data]);

	const animatedStyle = useAnimatedStyle(() => ({
		height: withTiming(searchQuery ? height.value : 0, {
			duration: 300,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		}),
	}));

	const handleSubscribe = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan.id, subscriptionPlan: subscriptionPlans });
	}, [navigation, subscriptionPlan]);
	const handlePayNow = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans, subscriptionId: subscriptionId });
	}, [navigation, subscriptionPlan, subscriptionId]);

	const textinputRef = useRef<RNTextInput>(null);
	const insets = useSafeAreaInsets();
	const [textInputHeight, setTextInputHeight] = useState(0);
	const talentRollingTexts = [`“DOP”`, `“Music Director”`, `“John Colourist”`, `“DA Brand Name”`];
	const filmRollingTexts = [`“Brand Name”`, `“Automobile”`, `“Beauty”`];
	const producerRollingTexts = [`“PH Name”`, `“Brand Name”`];
	const rollingTexts = state.activeTab === 0 ? talentRollingTexts : state.activeTab === 1 ? filmRollingTexts : producerRollingTexts;

	useEffect(() => {
		if (!textinputRef.current) return;
		textinputRef.current?.measure((x, y, width, height) => setTextInputHeight(height));
	}, [textinputRef.current]);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			{!searchQuery && !state.query && (
				<View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: Platform.OS === 'ios' ? insets.top + textInputHeight / 2 + 6: textInputHeight / 2 + 6, left: 4 * theme.padding.base }}>
					<Text size="button" color="muted">
						Search for{' '}
					</Text>
					<RollingBar interval={500} defaultStyle={false}>
						{rollingTexts.map(it => (
							<Text key={it} size="button" color="muted">
								{it}
							</Text>
						))}
					</RollingBar>
				</View>
			)}
			<View style={styles.searchInputContainer}>
				<SearchIcon style={styles.searchIcon} color="white" size="22" />
				<TextInput ref={textinputRef} autoFocus={true} value={state.query || searchQuery} onSubmitEditing={e => handleSearch(e.nativeEvent.text)} onChange={handleSearchInputChange} style={styles.textInput} placeholderTextColor={theme.colors.borderGray} placeholder="" />
				{searchQuery && !state.query && Keyboard.isVisible() ? (
					<Animated.ScrollView style={[styles.dropdownItems, animatedStyle]}>
						{data?.map((item: any, index: number) => (
							<TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelect(item)}>
								<Text size="bodyMid" color="regular">
									{item.name}
								</Text>
							</TouchableOpacity>
						))}
					</Animated.ScrollView>
				) : null}
			</View>
			{restricted && (
				<View style={styles.restrictionContainer}>
					<View style={styles.searchCountContainer}>
						<Text size="bodySm" numberOfLines={1} color="muted">
							Searches Left:
						</Text>
						<Text size="bodySm" numberOfLines={1} color={searchesLeft === 0 ? 'error' : 'muted'}>
							{' '}
							{searchesLeft}
						</Text>
					</View>

					<Text size="bodySm" numberOfLines={1} color="muted">
						Keep exploring!{'  '}
						{subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED ? (
							<TouchableOpacity onPress={handlePayNow}>
								<Text size="bodySm" style={styles.subscribeNowText}>
									pay now
								</Text>
							</TouchableOpacity>
						) : (
							<TouchableOpacity onPress={handleSubscribe}>
								<Text size="bodySm" style={styles.subscribeNowText}>
									Subscribe now
								</Text>
							</TouchableOpacity>
						)}
						{'  '}
						for unlimited searches.
					</Text>
				</View>
			)}
			<View style={{ paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
				<Pressable onPress={() => handleTabSwitch(0)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: state.activeTab === 0 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: state.activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
					<Text size="button" numberOfLines={1} color={state.activeTab === 0 ? 'primary' : 'regular'}>
						Talents
					</Text>
					<View style={styles.absoluteContainer(state.activeTab === 0)} />
				</Pressable>
				<Pressable onPress={() => handleTabSwitch(1)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: state.activeTab === 1 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: state.activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
					<Text size="button" numberOfLines={1} color={state.activeTab === 1 ? 'primary' : 'regular'}>
						Films
					</Text>
					<View style={styles.absoluteContainer(state.activeTab === 1)} />
				</Pressable>
				<Pressable onPress={() => handleTabSwitch(2)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: state.activeTab === 2 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: state.activeTab === 2 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
					<Text size="button" numberOfLines={1} color={state.activeTab === 2 ? 'primary' : 'regular'}>
						Producers
					</Text>
					<View style={styles.absoluteContainer(state.activeTab === 2)} />
				</Pressable>
			</View>
			{state.activeTab === 0 ? <TalentSearches /> : state.activeTab === 1 ? <FilmSearches /> : <ProducerSearches />}
			{!state.query || !filters ? (
				<Button type="primary" style={{ marginHorizontal: theme.padding.base }} onPress={() => handleSearch(searchQuery)}>
					Search
				</Button>
			) : null}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		zIndex: 1,
	},
	loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	searchCountContainer: {
		flexDirection: 'row',
	},
	restrictionContainer: {
		paddingHorizontal: theme.padding.base,
		paddingBottom: theme.padding.base,
	},
	subscribeNowText: {
		color: theme.colors.primary,
		textDecorationLine: 'underline',
		textAlignVertical: 'center',
	},
	modalContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	modalContent: {
		width: CONSTANTS.screenWidth,
		alignItems: 'center',
	},
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
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
	searchContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
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
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.sm,
	},
	searchInputContainer: {
		width: '100%',
		marginVertical: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		position: 'relative',
		justifyContent: 'center',
		zIndex: 99,
	},
	textInput: {
		fontSize: theme.fontSize.button,
		fontFamily: theme.fontFamily.cgMedium,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingLeft: 44,
		backgroundColor: theme.colors.transparent,
	},
	searchIcon: {
		position: 'absolute',
		zIndex: 99,
		height: '100%',
		width: 56,
		left: theme.padding.base + (2 / 3) * theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	dropdownItems: {
		position: 'absolute',
		top: 47,
		left: 16,
		right: 16,
		zIndex: 99,
		backgroundColor: theme.colors.backgroundLightBlack,
		overflow: 'hidden',
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
