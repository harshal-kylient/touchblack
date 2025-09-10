import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllStudioFloors(query: string, dates: string[], from_time: string, to_time: string, filters?: string) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.studio_floor_search(query, String(dates), from_time, to_time, pageParam, filters));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllConversations', query, filters],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.length < 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page) || [],
	});

	return call;
}
