import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllNotifications() {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.all_notifications(pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllNotifications'],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
