import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const getAllData =
	(ownerId: UniqueId, query: string = '') =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.searchOtherWorks(ownerId, query, pageParam));
		return response.data;
	};

export default function useGetSearchOtherWorks(ownerId: UniqueId, query?: string) {
	const call = useInfiniteQuery({
		queryKey: ['useGetSearchOtherWorks', ownerId, query],
		queryFn: getAllData(ownerId, query),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 50 || allPages.length >= lastPage?.count / 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
