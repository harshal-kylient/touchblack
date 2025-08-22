import CONSTANTS from '@constants/constants';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import server from '@utils/axios';

const getAllData =
	(query: string, crewid: string, filters: string, per_page_entries?: number) =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search('film', query, pageParam, `crew_ids=${crewid}&${filters ? filters : ''}&per_page=${per_page_entries || 10}`));
		return response.data;
	};

const mutateData = (query: string, crewid: string, filters: string, per_page_entries?: number) => async () => {
	const response = await server.get(CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search('film', query, 1, `crew_ids=${crewid}&${filters ? filters : ''}&per_page=${per_page_entries || 10}`));
	return response.data;
};

// search films where this crew id is present with these filters
export default function useGetSearchedShowreel(query: string, crewid: string, filters?: string, per_page_entries?: number) {
	const call = useInfiniteQuery({
		queryKey: ['useGetSearchedShowreel', query, crewid, filters],
		queryFn: getAllData(query, crewid, filters, per_page_entries),
		initialPageParam: 1,
		enabled: Boolean(query) || Boolean(filters) || Boolean(per_page_entries),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 50 || allPages.length >= lastPage?.count / 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.results) || [],
	});

	const mutation = useMutation({
		mutationKey: ['useGetSearchedShowreel', query, crewid, filters],
		mutationFn: mutateData(query, crewid, filters, per_page_entries),
	});

	return { ...call, isRefreshing: mutation.isPending, mutate: mutation.mutate };
}
