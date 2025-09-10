import { ActivityIndicator, RefreshControl, SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Slideable } from '@touchblack/ui';

import TalentThumbnailCard from '@components/TalentThumbnailCard';
import ToggleArchiveButton from '@components/ToggleArchiveButton';
import useGetArchivedBlackBookList from '@network/useGetArchivedBlackBookList';
import Header from '@components/Header';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { FlashList } from '@shopify/flash-list';
import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import NoArchive from '@components/errors/NoArchive';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

function ArchivedBlackBookList() {
	const { data: archivedBlackBookData, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, isRefetching } = useGetArchivedBlackBookList();
	const { styles, theme } = useStyles(stylesheet);
	const { permissions, loginType } = useAuth();
	const editAllowed = loginType === 'producer' ? permissions?.includes('Blackbook::Edit') : true;
	const flattenedArchivedBlackBookData = archivedBlackBookData?.pages?.flatMap(page => page?.data) || [];
	const NoArchivedTalents = flattenedArchivedBlackBookData.length === 0 || (flattenedArchivedBlackBookData.length === 1 && Object.keys(flattenedArchivedBlackBookData[0]).length === 0);
	let archivedCount = null;
	if (!NoArchivedTalents) {
		archivedCount = flattenedArchivedBlackBookData.length;
	}
	const headerTitle = `Archived (${archivedCount !== null ? archivedCount : 0})`;

	const handleUnArchive = async (item: IBlackBookProfile) => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.UnarchiveTalent,
				data: {
					item,
				},
			},
		});
	};

	const onRefresh = async () => {
		await refetch();
	};

	return (
		<SafeAreaView style={styles.archivedScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name={headerTitle} />
			<FlashList
				data={flattenedArchivedBlackBookData}
				renderItem={({ item, index }: { item: IBlackBookProfile; index: number }) => <TalentThumbnailCard key={index} item={item} fromArchivedBlackBook={true} lastItem={index === flattenedArchivedBlackBookData?.length - 1} onArchive={editAllowed ? handleUnArchive : undefined} />}
				estimatedItemSize={100}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.5}
				ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
				refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
				ListEmptyComponent={
					<View style={{ flex: 1, height: (7.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoArchive />
					</View>
				}
			/>
		</SafeAreaView>
	);
}
export default ArchivedBlackBookList;

const stylesheet = createStyleSheet(theme => ({
	archivedScreenContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
