import { ActivityIndicator, Image, Pressable, RefreshControl, View } from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '@touchblack/ui';
import { FilterList, Timer } from '@touchblack/icons';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import IProducerSearch from '@models/dtos/IProducerSearch';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import DiscoverListPlaceholder from '@components/loaders/DiscoverListPlaceholder';
import useGetSearchedProducers from '@network/useGetSearchedProducers';
import { FlashList } from '@shopify/flash-list';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import { SearchStorage } from '@utils/storage';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import transformProducerFilter from '@models/transformers/transformProducerFilter';
import UserNotFound from '@components/errors/UserNotFound';
import CONSTANTS from '@constants/constants';

function ProducerSearches() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<any>();
	const { state, dispatch } = useFilterContext();
	const filters = transformProducerFilter(state.producerFilters);
	// TODO: check mutate.isPending
	const { data: response, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, mutate } = useGetSearchedProducers(state.query.toLowerCase().trim(), filters);
	const pageCount = response?.pages?.[0]?.count || 0;
	const data = response?.pages.flatMap(page => page?.results) || [];

	const renderItem = ({ item, index }: { item: IProducerSearch }) => (
		<TouchableOpacity
			key={item.id}
			onPress={() => {
				navigation.navigate('ProducerProfile', { id: item.id });
			}}
			style={styles.listItemContainer(index === data.length - 1)}>
			<View style={styles.imageContainer}>
				<Image style={styles.listImage} source={item.profile_picture_url ? { uri: createAbsoluteImageUri(item?.profile_picture_url) } : require('@assets/images/profileFallbackWithoutBorders.png')} />
			</View>
			<View style={{ justifyContent: 'center', paddingLeft: theme.padding.base }}>
				<Text color="regular" numberOfLines={1} size="bodyBig">
					{capitalized(item?.name)}
				</Text>
				<Text color="muted" numberOfLines={1} size="bodyMid">
					{capitalized(item?.producer_type?.replaceAll('_', ' '))}
				</Text>
			</View>
		</TouchableOpacity>
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
	// 				{SearchStorage.getString('search-history-producers-0') || SearchStorage.getString('search-history-producers-1') || SearchStorage.getString('search-history-producers-2') || SearchStorage.getString('search-history-producers-3') ? null : (
	// 					<Text size="button" color="muted" textAlign="center" style={{ paddingVertical: theme.padding.sm }}>
	// 						No suggestions available
	// 					</Text>
	// 				)}
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-producers-3') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-producers-3') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-producers-3')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-producers-2') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-producers-2') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-producers-2')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 				<View style={{ flexDirection: 'row', borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between' }}>
	// 					{SearchStorage.getString('search-history-producers-1') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-producers-1') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-producers-1')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 					{SearchStorage.getString('search-history-producers-0') ? (
	// 						<Pressable onPress={() => dispatch({ type: 'QUERY', value: SearchStorage.getString('search-history-producers-0') })} style={{ gap: theme.gap.xxs, flexDirection: 'row', alignItems: 'center', borderRightWidth: theme.borderWidth.slim, padding: theme.padding.base, borderColor: theme.colors.borderGray, flex: 1 }}>
	// 							<Timer size="24" color={theme.colors.typography} />
	// 							<Text size="button" color="regular" numberOfLines={1} style={{ maxWidth: '75%' }}>
	// 								{SearchStorage.getString('search-history-producers-0')}
	// 							</Text>
	// 						</Pressable>
	// 					) : null}
	// 				</View>
	// 			</View>
	// 		</View>
	// 	);
	// }

	return (
		<View style={styles.producersListContainer}>
			<View style={styles.labelContainer}>
				{state.query ? (
					<View style={{ flexDirection: 'row' }}>
						<Text size="button" color="primary">
							{pageCount}
						</Text>
						<Text size="button" color="regular">
							{' '}
							Producers Found
						</Text>
					</View>
				) : (
					<Text size="button" color="primary">
						Latest
					</Text>
				)}
				<TouchableOpacity onPress={() => navigation.navigate('Filter')}>
					<FilterList color={filters ? theme.colors.primary : theme.colors.typography} size="24" strokeColor={theme.colors.typography} />
					{filters ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, position: 'absolute', top: 1, right: -5 }}></View> : null}
				</TouchableOpacity>
			</View>
			<View style={styles.flashListWrapper}>
				<FlashList
					data={data}
					contentContainerStyle={{ paddingBottom: 80 }}
					renderItem={renderItem}
					keyExtractor={item => item?.id || ''}
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
							<UserNotFound title="No Producer Found !" desc="Make sure input producer name is correct !" />
						</View>
					}
					ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
				/>
			</View>
		</View>
	);
}

export default ProducerSearches;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 64,
		height: 64,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentRow: {
		width: 'auto',
		flexGrow: 1,
		backgroundColor: theme.colors.black,
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
	listItemContainer: (condition: boolean) => ({
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: condition ? theme.borderWidth.slim : 0,
		borderColor: theme.colors.borderGray,
	}),
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
	},
	producersListContainer: {
		gap: theme.padding.base,
		backgroundColor: theme.colors.black,
	},
	placeholderContainer: {
		backgroundColor: theme.colors.black,
		paddingVertical: theme.padding.xxs,
		borderWidth: theme.borderWidth.slim,
		paddingTop: theme.margins.xxl,
	},
	activityIndicator: {
		marginTop: 20,
		marginBottom: 130,
	},
	flashListWrapper: {
		minHeight: UnistylesRuntime.screen.height * 0.68,
	},
}));
