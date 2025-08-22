import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';

function sanitizeFilters(filters: Record<string, string | number | null | undefined>): Record<string, string> {
	const cleaned: Record<string, string> = {};

	for (const key in filters) {
		const value = filters[key];
		if (value !== null && value !== undefined && value !== '') {
			cleaned[key] = String(value);
		}
	}
	return cleaned;
}

const getAllData =
	(filters: Record<string, string | number>, perPage = 10) =>
	async ({ pageParam = 1 }: { pageParam: number }) => {
		const safeFilters = sanitizeFilters(filters);
		const searchParams = new URLSearchParams({
			page: String(pageParam),
			per_page: String(perPage),
			...safeFilters,
		});

		const url = `${CONSTANTS.DOMAIN}/api/v1/search/event?${searchParams.toString()}`;
		const response = await server.get(url);
		return response.data;
	};

const mutateData =
	(filters: Record<string, string | number>, perPage = 10) =>
	async () => {
		const safeFilters = sanitizeFilters(filters);
		const searchParams = new URLSearchParams({
			page: '1',
			per_page: String(perPage),
			...safeFilters,
		});

		const url = `${CONSTANTS.DOMAIN}/api/v1/search/event?${searchParams.toString()}`;
		const response = await server.get(url);
		return response.data;
	};

export default function useGetSearchedEvents(filters: Record<string, string | number | null | undefined>, perPage = 10) {
	const queryKey = ['useGetSearchedEvents', filters, perPage];

	const call = useInfiniteQuery({
		queryKey,
		queryFn: getAllData(filters, perPage),
		initialPageParam: 1,
		enabled: Object.keys(filters).length > 0,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < perPage) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.results) || [],
	});

	const mutation = useMutation({
		mutationKey: queryKey,
		mutationFn: mutateData(filters, perPage),
	});

	return {
		...call,
		isRefreshing: mutation.isPending,
		mutate: mutation.mutate,
	};
}
