import CONSTANTS from '@constants/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProjectTalents(query: string, profession_type: string, dates: string[]) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.project_talents(query, profession_type, dates, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetProjectTalents', query, profession_type, dates],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage?.results?.length < 50 || allPages.length >= lastPage?.count / 50) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
