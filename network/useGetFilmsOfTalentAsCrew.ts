import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetFilmsOfTalentAsCrew(talentId: UniqueId) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_showreel_without_profession_id(talentId, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetFilmsOfTalentAsCrew', talentId],
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
