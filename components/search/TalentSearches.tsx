import { ActivityIndicator, Pressable, RefreshControl, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@touchblack/ui';
import { Bookmark, FilterList, Timer } from '@touchblack/icons';

import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import DiscoverListPlaceholder from '@components/loaders/DiscoverListPlaceholder';
import useGetSearchedTalents from '@network/useGetSearchedTalents';
import { FlashList } from '@shopify/flash-list';
import UserItem from '@components/UserItem';
import { SearchStorage } from '@utils/storage';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import transformTalentFilter from '@models/transformers/transformTalentFilter';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import UserNotFound from '@components/errors/UserNotFound';
import CONSTANTS from '@constants/constants';

function TalentSearches() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<any>();
	const { state, dispatch } = useFilterContext();
	const filters = transformTalentFilter(state.talentFilters);
	const { data: response, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, mutate } = useGetSearchedTalents(state.query.toLowerCase().trim(), filters);

	const pageCount = response?.pages?.[0]?.count || 0;
	const data = response?.pages.flatMap(page => page?.results) || [];

	function handleBlackBook(talentData) {
		if (!talentData?.is_bookmarked) {
			navigation.navigate('AddToBlackBook', { talentData: talentData });
		}
	}

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
	// 				{SearchStorage.getString('search-history-talents-0') || SearchStorage.getString('search-history-talents-1') || SearchStorage.getString('search-history-talents-2') || SearchStorage.getString('search-history-talents-3') ? null : (
	// 					<Text size="button" color="muted" textAlign="center" style={{ paddingVertical: theme.padding.sm }}>
	// 						No suggestions available
	// 					</Text>
	// 				)}
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-talents-3') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-talents-3') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-talents-3')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-talents-2') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-talents-2') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-talents-2')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-talents-1') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-talents-1') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-talents-1')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-talents-0') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-talents-0') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-talents-0')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 			</View>
	// 		</View>
	// 	);
	// }

	return (
		<View style={styles.talentListContainer}>
			<View style={styles.labelContainer}>
				{state.query ? (
					<View style={{ flexDirection: 'row' }}>
						<Text size="button" color="primary">
							{pageCount}
						</Text>
						<Text size="button" color="regular">
							{' '}
							Talents Found
						</Text>
					</View>
				) : (
					<Text size="button" color="primary">
						Latest
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
					renderItem={({ item }) => (
						<UserItem
							name={(item.first_name || '') + ' ' + (item?.last_name || '')}
							id={item.id}
							verified={item.verified}
							profession={item.profession_type}
							onPress={() => navigation.navigate('TalentProfile', { id: item?.id })}
							image={createAbsoluteImageUri(item.profile_picture_url)}
							// cta={
							// 	// <View>
							// 	// 	{!item?.is_claimed && (
							// 	// 		<View style={styles.claimedContainer}>
							// 	// 			<Text color="regular" numberOfLines={1} size="cardSubHeading">
							// 	// 				Unclaimed
							// 	// 			</Text>
							// 	// 		</View>
							// 	// 	)}
							// 	// </View>
								
							// }
						/>
					)}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={mutate} />}
					keyExtractor={item => item?.id || ''}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					estimatedItemSize={64}
					onEndReachedThreshold={0.5}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<UserNotFound title="No Talent Found !" desc="Make sure input talent name is correct !" />
						</View>
					}
					ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
				/>
			</View>
		</View>
	);
}

export default TalentSearches;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	claimedContainer: {
		backgroundColor: theme.colors.verifiedBlue,
		paddingVertical: theme.padding.xxxs * 2,
		paddingHorizontal: theme.padding.xs,
		alignSelf: 'flex-start',
		marginTop: theme.margins.xs,
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
	flatlistContainer: {
		marginBottom: 80,
	},
	placeholderContainer: {
		backgroundColor: theme.colors.black,
		paddingVertical: theme.padding.xxs,
		borderWidth: theme.borderWidth.slim,
		paddingTop: theme.margins.xxl,
	},
	talentListContainer: {
		backgroundColor: theme.colors.black,
		gap: theme.padding.base,
	},
	talentItem: {
		width: 'auto',
		flexGrow: 1,
		backgroundColor: theme.colors.black,
	},
	flashListWrapper: {
		minHeight: UnistylesRuntime.screen.height * 0.68,
	},
}));
