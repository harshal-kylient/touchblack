import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Pressable, SafeAreaView, SectionList, View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FilterList } from '@touchblack/icons';
import { Text as TextUi } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import { EventsFilterStorage } from '@utils/storage';
import useGetAllEvents from '@network/useAllGetEvents';
import NoLikedFilms from '@components/errors/NoLikedFilms';
import CONSTANTS from '@constants/constants';
import useGetSearchedEvents from '@network/useGetSearchedEvents';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function UpComingEventsList() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const storedFilterJSON = EventsFilterStorage.getString('eventFilters');
	const parsedFilters = storedFilterJSON ? JSON.parse(storedFilterJSON) : {};
	const onEndReachedCalledDuringMomentum = useRef(false);

	const [filters, setFilters] = useState({
		year: parsedFilters?.year ?? null,
		month_name: parsedFilters?.month ?? null,
		city: parsedFilters?.city ?? null,
	});

	useEffect(() => {
		const loadFilters = () => {
			const storedFilterJSON = EventsFilterStorage.getString('eventFilters');
			const parsedFilters = storedFilterJSON ? JSON.parse(storedFilterJSON) : {};

			setFilters({
				year: parsedFilters?.year ?? null,
				month_name: parsedFilters?.month ?? null,
				city: parsedFilters?.city ?? null,
			});
		};
		loadFilters();
		const unsubscribe = navigation.addListener('focus', loadFilters);

		return () => {
			unsubscribe();
		};
	}, [navigation]);

	const hasActiveFilters = useMemo(() => {
		return (filters.month_name !== null && filters.month_name !== '') || (filters.year !== null && filters.year !== '') || (filters.city !== null && filters.city !== '');
	}, [filters]);

	const { data: allEventsResponse, isLoading: isLoadingAll, isError: isErrorAll, fetchNextPage: fetchNextPageAll, hasNextPage: hasNextPageAll, isFetchingNextPage: isFetchingNextPageAll } = useGetAllEvents(hasActiveFilters);
	const allEvents = allEventsResponse?.pages?.flatMap(page => page?.data?.events ?? []) || [];

	const {
		data: searchedEventsResponse,
		isLoading: isLoadingSearched,
		isError: isErrorSearched,
		fetchNextPage: fetchNextPageSearched,
		hasNextPage: hasNextPageSearched,
		isFetchingNextPage: isFetchingNextPageSearched,
	} = useGetSearchedEvents({
		year: filters?.year,
		month_name: filters?.month_name,
		city: filters?.city,
	});
	const searchedEvents = searchedEventsResponse || [];

	const allEventsSections = useMemo(() => {
		const sections = {};

		allEvents.forEach(event => {
			const date = new Date(event?.event_date);
			const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
			if (!sections[monthYear]) sections[monthYear] = [];
			sections[monthYear].push(event);
		});
		return Object.keys(sections)
			.sort((a, b) => {
				const dateA = new Date(sections[a][0]?.event_date);
				const dateB = new Date(sections[b][0]?.event_date);
				return dateA - dateB;
			})
			.map(key => ({
				title: key,
				data: sections[key].sort((a, b) => new Date(a?.event_date) - new Date(b?.event_date)),
			}));
	}, [allEvents]);

	const searchedEventsSections = useMemo(() => {
		const sections = {};

		searchedEvents.forEach(event => {
			const date = new Date(event?.event_date);
			const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
			if (!sections[monthYear]) sections[monthYear] = [];
			sections[monthYear].push(event);
		});
		return Object.keys(sections)
			.sort((a, b) => {
				const dateA = new Date(sections[a][0].event_date);
				const dateB = new Date(sections[b][0].event_date);
				return dateA - dateB;
			})
			.map(key => ({
				title: key,
				data: sections[key].sort((a, b) => new Date(a.event_date) - new Date(b.event_date)),
			}));
	}, [searchedEvents]);

	const handleFilterPress = useCallback(() => {
		navigation.navigate('EventsFilter');
	}, [navigation]);

	const renderEventItem = ({ item, index }) => {
		const date = new Date(item.event_date);
		return (
			<TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event_id: item.id, past_event:false })}>
				<View style={styles.eventItem(index)}>
					<View style={styles.eventDate}>
						<Text style={styles.eventDay}>{date.getDate()}</Text>
						<Text style={styles.eventMonth}>{monthNames[date.getMonth()].slice(0, 3)}</Text>
					</View>
					<Image source={item?.poster_url ? { uri: item?.poster_url } : require('../../assets/images/loadingImage.png')} style={styles.eventImage}  resizeMode=''/>
					<View style={styles.eventTitleView}>
						<TextUi color="regular" size="bodyBig" numberOfLines={1}>
							{item.title}
						</TextUi>
						<TextUi color="muted" size="bodyMid" numberOfLines={1}>
							{item.city}
						</TextUi>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderAllEventsFooter = () => {
		if (!isFetchingNextPageAll) return null;
		return (
			<View style={{ paddingVertical: 16 }}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
			</View>
		);
	};

	const renderSearchedEventsFooter = () => {
		if (!isFetchingNextPageSearched) return null;
		return (
			<View style={{ paddingVertical: 16 }}>
				<ActivityIndicator size="small" color={theme.colors.primary} />
			</View>
		);
	};

	if ((!hasActiveFilters && isLoadingAll) || (hasActiveFilters && isLoadingSearched)) {
		return (
			<SafeAreaView style={styles.container}>
				<ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
			</SafeAreaView>
		);
	}

	if ((!hasActiveFilters && isErrorAll) || (hasActiveFilters && isErrorSearched)) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={{ color: theme.colors.muted, marginTop: 20, textAlign: 'center' }}>Failed to load events.</Text>
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.container}>
			<View style={{ position: 'relative', alignSelf: 'flex-end', flexDirection: 'row' }}>
				<Pressable onPress={handleFilterPress} style={{ padding: theme.padding.xs }}>
					<FilterList size="24" color={hasActiveFilters ? theme.colors.primary : theme.colors.typography} />
				</Pressable>
				{hasActiveFilters && <View style={styles.filterDot} />}
			</View>

			{!hasActiveFilters ? (
				<SectionList
					sections={allEventsSections}
					keyExtractor={item => item.id}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionHeaderText}>{title}</Text>
						</View>
					)}
					renderItem={renderEventItem}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoLikedFilms title="No Results" desc={'No Events found for the current query'} />
						</View>
					}
					onEndReached={() => {
						if (hasNextPageAll && !isFetchingNextPageAll && !onEndReachedCalledDuringMomentum.current) {
							fetchNextPageAll();
							onEndReachedCalledDuringMomentum.current = true;
						}
					}}
					onMomentumScrollBegin={() => {
						onEndReachedCalledDuringMomentum.current = false;
					}}
					onEndReachedThreshold={0.5}
					ListFooterComponent={renderAllEventsFooter}
				/>
			) : (
				<SectionList
					sections={searchedEventsSections}
					keyExtractor={item => item.id}
					renderSectionHeader={({ section: { title } }) => (
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionHeaderText}>{title}</Text>
						</View>
					)}
					renderItem={renderEventItem}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoLikedFilms title="No Results" desc={'No Events found for the current query'} />
						</View>
					}
					onEndReached={() => {
						if (hasNextPageSearched && !isFetchingNextPageSearched && !onEndReachedCalledDuringMomentum.current) {
							fetchNextPageSearched();
							onEndReachedCalledDuringMomentum.current = true;
						}
					}}
					onMomentumScrollBegin={() => {
						onEndReachedCalledDuringMomentum.current = false;
					}}
					onEndReachedThreshold={0.5}
					ListFooterComponent={renderSearchedEventsFooter}
				/>
			)}
		</View>
	);
}

export default UpComingEventsList;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
		marginTop:theme.margins.xxxs
	},
	sectionHeader: {
		backgroundColor: theme.colors.backgroundLightBlack,
		padding: theme.padding.base,
		paddingVertical: theme.padding.sm * 1.25,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	sectionHeaderText: {
		color: theme.colors.typography,
		fontSize: 20,
	},
	eventItem: index => ({
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		...(index === 0 && {
			borderTopColor: theme.colors.borderGray,
			borderTopWidth: theme.borderWidth.slim,
		}),
	}),
	eventDate: {
		width: 64,
		height: 64,
		padding: theme.padding.sm,
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	eventDay: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.primaryH3,
		fontWeight: theme.fontWeight.medium,
	},
	eventMonth: {
		color: theme.colors.typography,
		fontSize: theme.fontSize.typographySm,
	},
	eventImage: {
		width: 64,
		height: 64,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	eventTitleView: {
		flex: 1,
		height: 64,
		paddingHorizontal: theme.padding.sm,
		alignItems: 'flex-start',
		justifyContent: 'center',
		borderColor: theme.colors.borderGray,
	},
	filterDot: {
		position: 'absolute',
		top: 12,
		right: 12,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: theme.colors.primary || '#007AFF',
	},
}));
