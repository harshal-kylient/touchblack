import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetCrewList(filmId: string) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.crewlist(filmId, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetCrewList', filmId],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage.data?.results?.length < 10 || allPages.length >= lastPage?.data?.count / 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
