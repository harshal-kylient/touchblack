import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';

import CONSTANTS from '@constants/constants';
import { TalentSearchType } from '@components/sheets/addTeamMemberSheet/AddTeamMemberSheet';
import UserItem from '@components/UserItem';
import { Bookmark } from '@touchblack/icons';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

interface TalentListProps {
	talents: TalentSearchType[];
	isLoading: boolean;
	isFetching: boolean;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	onEndReached: () => void;
	onRefresh: () => void;
	onItemPress: (id: string) => void;
}

const TalentList = React.memo(({ talents, isLoading, isFetching, isFetchingNextPage, hasNextPage, onEndReached, onRefresh, onItemPress }: TalentListProps) => {
	const { styles, theme } = useStyles(stylesheet);

	const renderItem = useCallback(
		({ item, index }: { item: TalentSearchType; index: number }) => {
			return <UserItem id={item?.id} image={createAbsoluteImageUri(item?.profile_picture_url)} name={item?.full_name} profession={item?.profession_type} cta={<View style={{ flex: 1 }}>{item?.is_bookmarked ? <Bookmark size="24" color={theme.colors.primary} strokeColor={theme.colors.primary} strokeWidth={2} /> : <Bookmark size="24" color="none" strokeColor={theme.colors.typography} strokeWidth={2} />}</View>} onPress={() => onItemPress(item.id)} />;
		},
		[talents.length, onItemPress],
	);

	const keyExtractor = useCallback((item: TalentSearchType) => item?.id || '', []);

	const ListEmptyComponent = useMemo(
		() => (
			<View style={styles.emptyListContainer}>
				<Text size="bodyBig" color="regular">
					No users found
				</Text>
			</View>
		),
		[styles.emptyListContainer],
	);

	const ListFooterComponent = useMemo(() => (isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null), [isFetchingNextPage, theme.colors.primary]);

	if (isLoading) {
		return <ActivityIndicator style={styles.loadingIndicator} size="small" color={theme.colors.primary} />;
	}

	return <FlashList data={talents} renderItem={renderItem} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />} keyExtractor={keyExtractor} onEndReached={onEndReached} estimatedItemSize={100} onEndReachedThreshold={0.5} ListFooterComponent={ListFooterComponent} windowSize={5} maxToRenderPerBatch={10} updateCellsBatchingPeriod={50} ListEmptyComponent={ListEmptyComponent} />;
});

const stylesheet = createStyleSheet(theme => ({
	loadingIndicator: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyListContainer: {
		flex: 1,
		height: (7 * CONSTANTS.screenHeight) / 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));

export default TalentList;
