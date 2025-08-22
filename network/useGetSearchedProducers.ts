import CONSTANTS from '@constants/constants';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import server from '@utils/axios';

const getAllData =
	(query: string, filters: string) =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.search('producer', query, pageParam, filters));
		return response.data;
	};

const mutateData = (query: string, filters: string) => async () => {
	const response = await server.get(CONSTANTS.endpoints.search('producer', query, 1, filters));
	return response.data;
};

export default function useGetSearchedProducers(query: string, filters: string) {
	const call = useInfiniteQuery({
		queryKey: ['useGetSearchedProducers', query, filters],
		queryFn: getAllData(query, filters),
		enabled: Boolean(query) || Boolean(filters),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 50 || allPages.length >= lastPage?.count / 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	const mutation = useMutation({
		mutationFn: mutateData(query, filters),
		mutationKey: ['useGetSearchedProducers', query, filters],
	});

	return { ...call, isRefreshing: mutation.isPending, mutate: mutation.mutate };
}
