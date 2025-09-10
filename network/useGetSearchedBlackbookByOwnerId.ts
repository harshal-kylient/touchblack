import { useInfiniteQuery } from '@tanstack/react-query';

import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { transformBlackBookData } from '@models/transformers/transformBlackBookData';

interface IGetSearchedBlackBookByOwnerIdProps {
	ownerId: string | null | undefined;
	searchQuery?: string;
	rating?: string;
	profession_id?: string;
}

export default function useGetSearchedBlackBookByOwnerId({ ownerId, searchQuery, rating, }: IGetSearchedBlackBookByOwnerIdProps) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.search_for_blackbook_by_owner_id(ownerId, pageParam, searchQuery, rating,));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetSearchedBlackBookByOwnerId', ownerId, searchQuery, rating,],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.data || lastPage?.data?.length === 0) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: transformBlackBookData,
	});

	return call;
}
