import CONSTANTS from '@constants/constants';
import SearchParamEnum from '@models/enums/SearchParamEnum';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProfessions() {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.populate_data(SearchParamEnum.Profession));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetProfessions'],
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
