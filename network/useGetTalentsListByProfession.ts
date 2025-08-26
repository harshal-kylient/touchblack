import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const getAllData =
	(query: string, profession: string) =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const url = CONSTANTS.endpoints.search('user', query || '', pageParam, `profession_type=${profession}&`);
		const response = await server.get(url);
		return response.data;
	};

export function useGetTalentsListByProfession(profession: string, query?: string) {
	const call = useInfiniteQuery({
		queryKey: ['useGetTalentsListByProfession', profession, query],
		queryFn: getAllData(query || '', profession),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || lastPage?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
