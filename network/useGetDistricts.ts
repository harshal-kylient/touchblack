import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetDistricts(query: string = '') {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.search('district', query));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetDistricts', query],
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
