import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const useGetProducerTeams = (producerId: UniqueId) => {
	const getAllData = async ({ pageParam = 1 }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_producer_team_members(producerId), {
			params: { page: pageParam },
		});
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetProducerTeams', producerId],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || lastPage?.results?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
};

export default useGetProducerTeams;
