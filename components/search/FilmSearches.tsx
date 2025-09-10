import { View, ActivityIndicator, Pressable, RefreshControl } from 'react-native';

import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Text } from '@touchblack/ui';

import IFilm from '@models/entities/IFilm';

import SearchedFilmListItem from '@components/SearchedFilmListItem';
import { FilterList, Timer } from '@touchblack/icons';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import DiscoverListPlaceholder from '@components/loaders/DiscoverListPlaceholder';
import { SearchStorage } from '@utils/storage';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import useGetSearchedFilms from '@network/useGetSearchedFilms';
import transformFilmFilter from '@models/transformers/transformFilmFilter';
import NoLikedFilms from '@components/errors/NoLikedFilms';
import CONSTANTS from '@constants/constants';

function FilmSearches() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<any>();
	const { state, dispatch } = useFilterContext();
	const filters = transformFilmFilter(state.filmFilters);
	// TODO: check mutate.isPending
	const { data: response, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, mutate } = useGetSearchedFilms(state.query.toLowerCase().trim(), filters);
	const pageCount = response?.pages?.[0]?.count || 0;
	const data = response?.pages.flatMap(page => page?.results) || [];

	const renderItem = ({ item, index }: { item: IFilm; index: number }) => (
		<SearchedFilmListItem
			item={item}
			style={{ borderBottomWidth: index === data.length - 1 ? theme.borderWidth.slim : 0 }}
			onPress={() => {
				navigation.navigate('VideoPlayer', { id: item?.id });
			}}
		/>
	);

	if (isLoading) {
		return (
			<View style={styles.placeholderContainer}>
				<TextWithIconPlaceholder />
				<DiscoverListPlaceholder numberOfItems={9} />
			</View>
		);
	}

	// if (!filters && !state.query) {
	// 	return (
	// 		<View style={{ flex: 1, backgroundColor: theme.colors.black }}>
	// 			<Text size="primaryMid" color="regular" style={{ padding: theme.padding.base, paddingTop: theme.padding.xxxl }}>
	// 				Suggestions
	// 			</Text>
	// 			<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: theme.padding.base }}>
	// 				{SearchStorage.getString('search-history-films-0') || SearchStorage.getString('search-history-films-1') || SearchStorage.getString('search-history-films-2') || SearchStorage.getString('search-history-films-3') ? null : (
	// 					<Text size="button" color="muted" textAlign="center" style={{ paddingVertical: theme.padding.sm }}>
	// 						No suggestions available
	// 					</Text>
	// 				)}
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-films-3') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-films-3') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-films-3')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-films-2') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-films-2') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-films-2')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-films-1') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-films-1') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-films-1')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-films-0') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-films-0') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-films-0')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 			</View>
	// 		</View>
	// 	);
	// }

	return (
		<View style={styles.filmSearchContainer}>
			<View style={styles.labelContainer}>
				{state.query ? (
					<View style={{ flexDirection: 'row' }}>
						<Text size="button" color="primary">
							{pageCount}
						</Text>
						<Text size="button" color="regular">
							{' '}Films Found
						</Text>
					</View>
				) : (
					<Text size="button" color="primary">
						Latest Films
					</Text>
				)}
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('Filter');
					}}>
					<FilterList color={filters ? theme.colors.primary : theme.colors.typography} size="24" strokeColor={theme.colors.typography} />
					{filters ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, position: 'absolute', top: 1, right: -5 }}></View> : null}
				</TouchableOpacity>
			</View>
			<View style={styles.flashListWrapper}>
				<FlashList
					data={data}
					contentContainerStyle={{ paddingBottom: 80 }}
					renderItem={renderItem}
					keyExtractor={(item, index) => String(index)}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={mutate} />}
					estimatedItemSize={64}
					onEndReachedThreshold={0.5}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoLikedFilms title="No Film Found !" desc="Make sure input film name is correct !" blackBackground />
						</View>
					}
					ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
				/>
			</View>
		</View>
	);
}

export default FilmSearches;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 118,
		height: 67,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		alignSelf: 'flex-start',
		paddingVertical: theme.padding.xxxs,
		paddingHorizontal: theme.padding.base,
		marginTop: theme.margins.xl,
	},
	listImage: {
		width: '100%',
		height: '100%',
	},
	listItemContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
	},
	flashListWrapper: {
		minHeight: UnistylesRuntime.screen.height * 0.68,
	},
	activityIndicator: {
		marginTop: 20,
	},
	filmSearchContainer: {
		gap: theme.padding.base,
		backgroundColor: theme.colors.black,
	},
	placeholderContainer: {
		backgroundColor: theme.colors.black,
		paddingVertical: theme.padding.xxs,
		borderWidth: theme.borderWidth.slim,
		paddingTop: theme.margins.xxl,
	},
	filmItemContainer: {
		width: 'auto',
		flexGrow: 1,
		backgroundColor: theme.colors.black,
	},
}));
