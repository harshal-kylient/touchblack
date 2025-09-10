import CONSTANTS from '@constants/constants';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProducerProjects(status: EnumProducerStatus, enabled: boolean = true, query?: string) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.producer_all_projects(status, pageParam, query));
		if (!response.data?.success) {
			return {
				message: 'No Project found',
				success: false,
				data: [],
			};
		}
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetProducerProjects', status, query],
		queryFn: getAllData,
		initialPageParam: 1,
		enabled,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.data) || [],
	});

	return call;
}
