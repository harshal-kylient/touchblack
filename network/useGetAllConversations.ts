import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllConversations(projectId?: UniqueId) {
	const { loginType, userId, producerId, authToken } = useAuth();
	const owner_id = loginType === 'producer' ? producerId : userId;
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.all_conversations(owner_id!, pageParam, projectId));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllConversations', owner_id, projectId],
		queryFn: getAllData,
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.conversations?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => res?.pages?.flatMap(page => page?.data?.conversations) || [],
	});

	return call;
}
