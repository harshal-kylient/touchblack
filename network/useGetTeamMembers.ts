import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetTeamMembers(producerId: UniqueId) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_team_member(producerId!, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetTeamMembers', producerId],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || !lastPage?.success || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
