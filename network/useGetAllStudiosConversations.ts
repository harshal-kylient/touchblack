import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useStudioContext } from '@presenters/studio/StudioContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllStudiosConversations(projectId?: UniqueId) {
	const { loginType, producerId } = useAuth();
	const { studioFloor } = useStudioContext();
	const owner_id = loginType === 'producer' ? producerId : studioFloor?.id;

	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.list_all_studio_conversations(owner_id!, projectId!, pageParam));
		return response;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllStudiosConversations', owner_id, projectId, studioFloor],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.data?.success || !lastPage.data?.data || lastPage.data?.data?.conversations?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => ({
			status: res?.pages?.[0]?.status,
			data: res?.pages?.flatMap(page => page?.data?.data?.conversations) || [],
		}),
	});

	return call;
}
