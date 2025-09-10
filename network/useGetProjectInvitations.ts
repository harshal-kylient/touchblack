import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import EnumStatus from '@models/enums/EnumStatus';

export default function useGetProjectInvitations(projectId: UniqueId, professionId?: UniqueId, status?: EnumStatus) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.get_project_invitations(projectId, professionId, status, pageParam));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetProjectInvitations', projectId, professionId, status],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
	});

	return call;
}
