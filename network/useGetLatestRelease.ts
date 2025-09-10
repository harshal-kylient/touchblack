import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetLatestRelease() {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.latest_release(pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetLatestRelease'],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || lastPage?.data?.length < 13) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
