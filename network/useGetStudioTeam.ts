import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const useGetStudioTeam = (studioId: string) => {
	const getAllData = async ({ pageParam = 1 }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_studio_team_members(studioId), {
			params: { page: pageParam },
		});
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetStudioTeam', studioId],
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

export default useGetStudioTeam;
