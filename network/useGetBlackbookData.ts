import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetBlackbookData(query?: string) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.get_blackbook_data('', pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetBlackbookData', query],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res.pages?.flatMap(it => it) || [],
	});

	return call;
}
