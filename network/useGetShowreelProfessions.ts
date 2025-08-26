import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetShowreelProfessions(talentId: UniqueId) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.film_professions(talentId, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetShowreelProfessions', talentId],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages.flatMap(page => page?.data) || [],
	});

	return call;
}
