import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';

import CONSTANTS from '@constants/constants';
import { TalentSearchType } from '@components/sheets/addTeamMemberSheet/AddTeamMemberSheet';
import MemoizedListItem from './MemoizedListItem';

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
			const isLast = index === talents.length - 1;
			return <MemoizedListItem item={item} isLast={isLast} onPress={() => onItemPress(item.id)} />;
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
