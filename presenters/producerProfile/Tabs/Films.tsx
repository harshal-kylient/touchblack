import { ActivityIndicator, View, FlatList, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import FilmItem from '@components/FilmItem';
import { Text } from '@touchblack/ui';
import { useAuth } from '@presenters/auth/AuthContext';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import SearchInput from '@components/SearchInput';
import { Filter } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import transformFilmFilter from '@models/transformers/transformFilmFilter';
import { useFilterContext } from './FilterContext';
import useGetSearchedProducerFilms from '@network/useGetSearchedProducerFilms';
import useGetProducerFilms from '@network/useGetProducerFilms';

const Films = ({ producerId, paddingBottom, header }: { producerId: string; paddingBottom: number; header?: ReactElement }) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { producerId: loggedInProducerId } = useAuth();
	const { data: producerFilmsResponse, isLoading: isProducerFilmsLoading, isFetchingNextPage: isProducerFilmsFetchingNextPage, refetch: refetchProducerFilms, hasNextPage: hasProducerFilmsNextPage, fetchNextPage: fetchProducerFilmsNextPage } = useGetProducerFilms(producerId);
	const producerFilms = producerFilmsResponse?.pages?.flatMap(it => it?.data) || [];
	const [query, setQuery] = useState('');
	const { state } = useFilterContext();

	const filters = transformFilmFilter({
		video_type_id: state.video_type_id,
		brand: state.brand,
		duration: state.duration,
		genre_ids: state.genre_ids,
		industry_id: state.industry_id,
		language_id: state.language_id,
		year_of_release: state.year_of_release,
	});

	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useGetSearchedProducerFilms(query, producerId, filters);

	const handleFilterPress = useCallback(() => {
		navigation.navigate('ProducerFilmsFilter');
	}, [navigation]);

	return (
		<View style={{ flex: 1, minHeight: '100%', paddingBottom, backgroundColor: theme.colors.black,}}>
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
			<FlatList
				contentContainerStyle={{paddingBottom:theme.padding.base*20}}
				bounces={false}
				ListHeaderComponent={header}
				data={query || filters ? data : producerFilms}
				renderItem={({ item: film }: any) => (
					<View key={film?.film_id} style={styles.filmItemsContainer}>
						<FilmItem
							mutate={() => {
								refetch();
								refetchProducerFilms();
							}}
							editable={producerId === loggedInProducerId}
							type={FilmOptionsEnum.ProducerFilms}
							key={film?.film_id}
							film={film}
						/>
					</View>
				)}
				onEndReachedThreshold={0.5}
				keyExtractor={(film: any) => film?.film_id || ''}
				onEndReached={() => {
					if (query && !isLoading && hasNextPage) {
						fetchNextPage();
					} else if (!query && !isProducerFilmsLoading && hasProducerFilmsNextPage) {
						fetchProducerFilmsNextPage();
					}
				}}
				ListFooterComponent={() => (isFetchingNextPage || isProducerFilmsFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} style={{ width: 200, height: 193, justifyContent: 'center', alignItems: 'center' }} /> : null)}
				ListEmptyComponent={
					<Text color="muted" size="button" style={styles.textCenter}>
						No films added yet
					</Text>
				}
			/>
		</View>
	);
};

export default Films;

const stylesheet = createStyleSheet(theme => ({
	filmItemsContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.bold,
		paddingHorizontal: theme.padding.base,
		paddingVertical: 1,
		borderColor: theme.colors.borderGray,
		marginBottom: theme.margins.xs,
	},
	textCenter: { textAlign: 'center' },
	inputWrapper: {
		paddingHorizontal: theme.padding.lg,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
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
}));
