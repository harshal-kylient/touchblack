import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

async function getAllData({ pageParam }: { pageParam: number }) {
	const response = await server.get(CONSTANTS.endpoints.discover_studios(pageParam));
	return response.data;
}

export default function useGetDiscoverStudios() {
	const call = useInfiniteQuery({
		queryKey: ['useGetDiscoverStudios'],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 10 || allPages.length >= lastPage?.count / 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res.pages?.flatMap(it => it?.data) || [],
	});

	return call;
}
