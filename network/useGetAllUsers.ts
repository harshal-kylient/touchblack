import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllUsers(query: string, type: 'User' | 'Producer' = 'User') {
	const endpoint = (pageParam: number) => (type === 'Producer' ? CONSTANTS.endpoints.search('producer', query, pageParam) : CONSTANTS.endpoints.search('user', query, pageParam));
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(endpoint(pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllUsers', query, type],
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
