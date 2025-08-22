import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllStudioUsers(query: string) {
	const endpoint = (pageParam: number) => CONSTANTS.endpoints.search('studio_user', query, pageParam);
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(endpoint(pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllStudioUsers', query],
		queryFn: getAllData,
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
