import { useCallback, useState, useMemo } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import TalentTypeHeader from '../professionsList/ProfessionsListHeader';
import UserItem from '@components/UserItem';
import SearchInput from '@components/SearchInput';
import UserNotFound from '@components/errors/UserNotFound';
import ImageAndTextListPlaceholder from '@components/loaders/ImageAndTextListPlaceholder';
import { useGetTalentsListByProfession } from '@network/useGetTalentsListByProfession';
import formatName from '@utils/formatName';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

type RouteParams = {
	data: {
		profession: string;
	};
};

type TalentTypeProps = {
	route: {
		params: RouteParams;
	};
};

export default function TalentListByProfession({ route }: TalentTypeProps) {
	const { profession } = route.params.data;
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const { data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching } = useGetTalentsListByProfession(profession.toLowerCase(), searchQuery);

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	const handleLoadMore = useCallback(() => {
		if (hasNextPage) {
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage]);

	const handleTalentRedirect = useCallback(
		(talentId: string) => {
			navigation.navigate('TalentProfile', { id: talentId });
		},
		[navigation],
	);

	const renderItem = useCallback(({ item }) => <UserItem id={item.id} name={formatName(item?.first_name, item?.last_name)} image={createAbsoluteImageUri(item?.profile_picture_url)} profession={item?.profession_type} onPress={() => handleTalentRedirect(item.id)} />, [handleTalentRedirect]);
	const flatListData = useMemo(() => data?.pages.flatMap(page => page.results) || [], [data]);

	return (
		<View style={styles.filterScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<TalentTypeHeader title={profession} />
			<SearchInput placeholderText={`Search ${profession}...`} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<FlashList
				data={flatListData}
				renderItem={renderItem}
				estimatedItemSize={100}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.5}
				refreshing={isRefetching}
				onRefresh={handleRefresh}
				ListEmptyComponent={
					isLoading ? (
						<>
							<ImageAndTextListPlaceholder />
							<ImageAndTextListPlaceholder />
							<ImageAndTextListPlaceholder />
							<ImageAndTextListPlaceholder />
						</>
					) : (
						<UserNotFound />
					)
				}
			/>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	filterScreenContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
}));
