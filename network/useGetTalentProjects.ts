import CONSTANTS from '@constants/constants';
import EnumStatus from '@models/enums/EnumStatus';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useAuth } from '@presenters/auth/AuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetTalentProjects(status?: EnumStatus, enabled: boolean = true, query?: string) {
	const { selectedTalent } = useTalentContext();
	const { loginType } = useAuth();
	const talent_id = selectedTalent?.talent?.user_id;
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		let url = CONSTANTS.endpoints.talent_all_projects(status, pageParam, query);

		if (loginType === 'manager') {
			url += `&talent_id=${talent_id}`;
		}
		const response = await server.get(url);
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
		queryKey: ['useGetTalentProjects', status, query],
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
