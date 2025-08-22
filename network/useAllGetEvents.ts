import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllEvents(is_past:boolean) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.events(is_past,pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllEvents', is_past],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}

