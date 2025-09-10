import { useState, useEffect, useMemo } from 'react';
import useGetSearchedBlackBookByOwnerId from '@network/useGetSearchedBlackbookByOwnerId';
import useGetBlackBookProfessions from '@network/useGetBlackBookProfessions';
import useGetArchivedBlackBookList from '@network/useGetArchivedBlackBookList';

function useBlackBookData(bookmark_id: string) {
	const { data: blackbookData, isLoading: isLoadingProfessions } = useGetBlackBookProfessions();
	const [searchQuery, setSearchQuery] = useState<string>('');

	const { data: searchedBlackbookData, isLoading: isLoadingSearchedBlackbook } = useGetSearchedBlackBookByOwnerId({
		ownerId: bookmark_id,
		searchQuery,
		rating: 'All',
	});
	const { data: archivedBlackBookData, fetchNextPage, hasNextPage } = useGetArchivedBlackBookList();

	useEffect(() => {
		if (hasNextPage) {
			fetchNextPage();
		}
	}, [blackbookData, hasNextPage, fetchNextPage]);

	const flattenedArchivedBlackBookData = useMemo(() => {
		if (!archivedBlackBookData) {
			return [];
		}
		return archivedBlackBookData.pages.flatMap(page => page?.data || []);
	}, [archivedBlackBookData]);

	const archivedIds = useMemo(() => new Set(flattenedArchivedBlackBookData.map(item => item.bookmark_id)), [flattenedArchivedBlackBookData]);

	const searchedBlackBookListExcludingArchivedProfiles = useMemo(() => {
		return searchedBlackbookData
			?.map(profession => ({
				...profession,
				content: profession.content.filter((profile: any) => !archivedIds.has(profile.bookmark_id)),
			}))
			.filter(profession => profession.content.length > 0);
	}, [searchedBlackbookData, archivedIds]);

	return {
		blackbookData,
		isLoadingProfessions,
		searchQuery,
		setSearchQuery,

		searchedBlackBookListExcludingArchivedProfiles,
		isLoadingSearchedBlackbook,
	};
}

export default useBlackBookData;
