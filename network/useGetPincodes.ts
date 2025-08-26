import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetPincodes(query: string = '') {
	const getAllData = async ({ pageParam = 1 }) => {
		const response = await server.get(CONSTANTS.endpoints.search('pincode', query), {
			params: { page: pageParam },
		});
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetPincodes', query],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || lastPage?.results?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
