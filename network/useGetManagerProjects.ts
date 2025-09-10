import CONSTANTS from '@constants/constants';
import EnumStatus from '@models/enums/EnumStatus';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetManagerProjects(userId?: string, status?: EnumStatus, enabled: boolean = true, query?: string) {
	const { selectedTalent } = useTalentContext();
	const resolvedUserId = userId ?? selectedTalent?.user_id;
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		if (!resolvedUserId) {
			return {
				message: 'No User ID provided',
				success: false,
				data: [],
			};
		}

		const response = await server.get(CONSTANTS.endpoints.manager_all_projects(resolvedUserId, status, pageParam, query));

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
		queryKey: ['useGetManagerProjects', resolvedUserId, status, query],
		queryFn: getAllData,
		initialPageParam: 1,
		enabled: enabled && !!resolvedUserId, // only enable if userId is resolved
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
