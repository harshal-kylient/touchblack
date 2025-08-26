import { FlatList, Pressable, RefreshControl, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { darkTheme } from '@touchblack/ui/theme';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import SearchInput from '@components/SearchInput';
import useGetSearchedShowreel from '@network/useGetSearchedShowreel';
import FilmItem from '@components/FilmItem';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { useAuth } from '@presenters/auth/AuthContext';
import NoLikedFilms from '@components/errors/NoLikedFilms';
import CONSTANTS from '@constants/constants';
import { useNavigation } from '@react-navigation/native';
import { Filter } from '@touchblack/icons';
import transformFilmFilter from '@models/transformers/transformFilmFilter';
import { useFilterContext } from './FilterContext';
import useGetShowreelsOtherWorks from '@network/useGetShowreelsOtherWorks';

const TalentShowReel = ({ talentId, paddingBottom }: { talentId: string; paddingBottom: number; header?: ReactElement }) => {
	const { styles, theme } = useStyles(stylesheet);
	const [query, setQuery] = useState('');
	const { userId, loginType } = useAuth();
	const navigation = useNavigation();
	const editable = talentId === userId || loginType === 'manager';
	const { data:response, isLoading, isFetchingNextPage, isRefetching, fetchNextPage, hasNextPage, refetch } = useGetShowreelsOtherWorks(talentId);
	const showreels = response?.pages?.flatMap(page => page.data || []) ?? [];
	const { state } = useFilterContext();

	const filters = useMemo(
		() =>
			transformFilmFilter({
				video_type_id: state.video_type_id,
				brand: state.brand,
				duration: state.duration,
				genre_ids: state.genre_ids,
				industry_id: state.industry_id,
				language_id: state.language_id,
				year_of_release: state.year_of_release,
				is_verified:state.is_verified,
			}),
		[state],
	);

	const { data: searchedShowreels, refetch: mutate, isFetching: isSearching } = useGetSearchedShowreel(query, talentId, filters);
	

	const handleFilterPress = useCallback(() => {
		navigation.navigate('ShowreelFilter');
	}, [navigation]);

	const renderContent = useCallback(() => {
		if (isLoading || isSearching) {
			return <SearchBarPlaceholder />;
		}

		if ((query || filters) && searchedShowreels?.length) {
			return searchedShowreels?.map(it => (
				<View key={it?.film_id} style={styles.filmItemsContainer}>
					<FilmItem showPinned mutate={mutate} editable={editable} type={FilmOptionsEnum.Showreel} film={it} />
				</View>
			));
		}

		if ((!query && !filters) && showreels?.length) {
			return (
				
					<FlatList
						data={showreels}
						keyExtractor={item => item.film_id.toString()}
						renderItem={({ item }) => (
							<View style={styles.filmItemsContainer}>
								<FilmItem showPinned mutate={mutate} editable={editable} type={FilmOptionsEnum.Showreel} film={item} />
							</View>
						)}
						onEndReached={() => {
							if (hasNextPage && !isFetchingNextPage) {
								fetchNextPage();
							}
						}}
						onEndReachedThreshold={0.5}
						refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
						ListFooterComponent={isFetchingNextPage ? <View style={{ height: 60 }} /> : null}
						contentContainerStyle={{ paddingBottom: 10 }}
					/>
				
			);}
		

		if ((query || filters) && !searchedShowreels?.length) {
			return (
				<View style={{ flex: 1, height: (5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
					<NoLikedFilms title="No Results" desc={'No showreel found for the current query'} />
				</View>
			);
		}

		return (
			<View style={{ flex: 1, height: (5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
				<NoLikedFilms title="No Showreels yet" desc={'No showreels available yet'} />
			</View>
		);
	}, [isLoading, isSearching, searchedShowreels, filters, query, talentId, userId, mutate]);

	return (
		<View style={[styles.filmsContainer, { paddingBottom :150}]}>
			<View style={{ flexDirection: 'row', gap: 0, minWidth: '100%', paddingRight: theme.padding.base }}>
				<SearchInput containerStyles={{ paddingRight: 0, flex: 1 }} searchQuery={query} setSearchQuery={setQuery} placeholderText="Search showreels" />
				<Pressable
					onPress={handleFilterPress}
					style={{
						backgroundColor: theme.colors.backgroundLightBlack,
						paddingHorizontal: theme.margins.base,
						marginVertical: theme.margins.base,
						justifyContent: 'center',
						alignItems: 'center',
						borderWidth: theme.borderWidth.slim,
						borderColor: theme.colors.borderGray,
						borderLeftWidth: 0,
					}}>
					<Filter color={filters ? theme.colors.primary : theme.colors.typography} size="20" />
					{filters ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, position: 'absolute', top: 12, right: 12 }}></View> : null}
				</Pressable>
			</View>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
			<View>{renderContent()}</View>
		</View>
	);
};

export default TalentShowReel;

const stylesheet = createStyleSheet(theme => ({
	filmsContainer: {
		position: 'relative',
		backgroundColor: theme.colors.black,
		flex: 1,
		minHeight: '100%',
	},
	textCenter: {
		paddingVertical: theme.padding.base,
		textAlign: 'center',
	},
	searchInputContainer: {
		width: '100%',
		paddingVertical: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
		position: 'relative',
		justifyContent: 'center',
		zIndex: 99,
	},
	textInput: {
		fontSize: theme.fontSize.button,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingLeft: 44,
		backgroundColor: theme.colors.black,
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
	filterBtn: {
		backgroundColor: theme.colors.backgroundLightBlack,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
		borderRightColor: theme.colors.borderGray,
		borderBottomColor: theme.colors.borderGray,
	},
	filmItemsContainer: {
		marginTop: theme.margins.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.bold,
		paddingHorizontal: theme.padding.base,
		paddingVertical: 1,
		borderColor: theme.colors.borderGray,
	},
}));
