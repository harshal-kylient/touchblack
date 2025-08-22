import CONSTANTS from '@constants/constants';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import server from '@utils/axios';

const getAllData =
	(query: string, owner_id: string, filters: string) =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search('film', query, pageParam, `owner_id=${owner_id}&${filters ? filters : ''}`));
		return response.data;
	};

const mutateData = (query: string, owner_id: string, filters: string) => async () => {
	const response = await server.get(CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search('film', query, 1, `owner_id=${owner_id}&${filters ? filters : ''}`));
	return response.data;
};

// search films where this crew id is present with these filters
export default function useGetSearchedProducerFilms(query: string, owner_id: string, filters: string) {
	const call = useInfiniteQuery({
		queryKey: ['useGetSearchedProducerFilms', query, owner_id, filters],
		queryFn: getAllData(query, owner_id, filters),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 50 || allPages.length >= lastPage?.count / 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.results) || [],
	});

	const mutation = useMutation({
		mutationFn: mutateData(query, owner_id, filters),
		mutationKey: ['useGetSearchedShowreel', query, owner_id, filters],
	});

	return { ...call, isRefreshing: mutation.isPending, mutate: mutation.mutate };
}
