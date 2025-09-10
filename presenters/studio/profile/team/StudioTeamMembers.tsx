import { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import SearchInput from '@components/SearchInput';
import { SheetType } from 'sheets';
import useDebounce from '@utils/useDebounce';
import TalentList from './TalentList';
import Header from '@components/Header';
import useGetAllStudioUsers from '@network/useGetAllStudioUsers';

export default function StudioTeamMembers() {
	const [searchQuery, setSearchQuery] = useState<string>('');
	const debouncedSearchQuery = useDebounce(searchQuery, 300);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch: mutate } = useGetAllStudioUsers(debouncedSearchQuery);

	const { styles, theme } = useStyles(stylesheet);

	const talents = useMemo(() => data?.pages?.flatMap(page => page.results) || [], [data?.pages]);

	const toggleAddMemberSheet = useCallback((id: string) => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioTeamMemberManagement,
				data: {
					userId: id,
					isNewMember: true,
				},
			},
		});
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={styles.contentContainer}>
				<Header name="Add Team Member" />
				<SearchInput placeholderText="Search for a Studio User..." searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<TalentList talents={talents} isLoading={isLoading} isFetching={isFetching} isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} onEndReached={fetchNextPage} onRefresh={mutate} onItemPress={toggleAddMemberSheet} />
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	contentContainer: {
		flex: 1,
		paddingVertical: theme.padding.base,
	},
}));
