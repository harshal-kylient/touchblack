import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetArchivedBlackBookList() {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_archived_blackbook(pageParam));
		if (!response.data?.success) {
			return {
				message: 'No Blackbook found',
				success: false,
				data: [],
			};
		}
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetArchivedBlackBookList'],
		queryFn: getAllData,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage.data.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		initialPageParam: 1,
	});

	return call;
}
