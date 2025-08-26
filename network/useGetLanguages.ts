import CONSTANTS from '@constants/constants';
import SearchParamEnum from '@models/enums/SearchParamEnum';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetLanguages() {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.populate_data(SearchParamEnum.Language));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetLanguages'],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
