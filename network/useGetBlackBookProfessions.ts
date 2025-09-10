import { useInfiniteQuery } from '@tanstack/react-query';

import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { transformBlackBookProfessionsData } from '@models/transformers/transformBlackBookProfessionsData';

export default function useGetBlackBookProfessions() {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_blackBook_talent_professions(pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetBlackBookProfessions'],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: transformBlackBookProfessionsData,
	});

	return call;
}
