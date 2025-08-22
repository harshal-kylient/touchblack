import Header from '@components/Header';
import UserItem from '@components/UserItem';
import UserNotFound from '@components/errors/UserNotFound';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import CONSTANTS from '@constants/constants';
import useGetTrendingTalents from '@network/useGetTrendingTalents';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Bookmark } from '@touchblack/icons';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { RefreshControl, SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function MostViewedTalentList() {
	const { data: response, isLoading, hasNextPage, fetchNextPage, isFetching, refetch } = useGetTrendingTalents();
	const data = response?.pages.flatMap(page => page?.data) || [];
	const navigation = useNavigation();
	const { theme } = useStyles(stylesheet);

	if (isLoading) return <MediumGridPlaceholder />;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Most Viewed Talent" />
			<FlashList
				showsHorizontalScrollIndicator={false}
				data={data}
				renderItem={({ item }) => (
					<UserItem
						name={(item.first_name || '') + ' ' + (item?.last_name || '')}
						id={item?.user_id}
						profession={item?.talent_role}
						onPress={() => navigation.navigate('TalentProfile', { id: item?.user_id })}
						image={createAbsoluteImageUri(item?.profile_picture_url)}
						cta={item?.is_bookmarked ? <Bookmark size="24" color={theme.colors.primary} strokeColor={theme.colors.primary} strokeWidth={2} /> : <Bookmark size="24" color="none" strokeColor={theme.colors.typography} strokeWidth={2} />}
					/>
				)}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
				estimatedItemSize={70}
				ListEmptyComponent={
					<View style={{ flex: 1, height: (7.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<UserNotFound title="No Talent Found !" desc="View more talents profile to generate more data !" />
					</View>
				}
				keyExtractor={item => item?.user_id}
			/>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({}));
