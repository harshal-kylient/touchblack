import CONSTANTS from '@constants/constants';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import EnumStatus from '@models/enums/EnumStatus';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import { useAuth } from '@presenters/auth/AuthContext';
import { useStudioContext } from '@presenters/studio/StudioContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllProjectOrTalentMessages(converstation_id: UniqueId, project_id?: UniqueId) {
	const { loginType, userId, producerId } = useAuth();
	const { studioFloor } = useStudioContext();
	const owner_id = loginType === 'producer' ? producerId : loginType === 'studio' ? studioFloor?.id : userId;

	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.fetch_conversation(converstation_id, owner_id!, pageParam, project_id));
		return response.data;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetAllMessages', converstation_id, owner_id, studioFloor, project_id],
		queryFn: getAllData,
		initialPageParam: 1,
		enabled: Boolean(converstation_id),
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage?.success || !lastPage?.data || lastPage?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => {
			return {
				messages: res?.pages?.flatMap(page => page?.data?.messages) || [],
				metadata: res?.pages?.[0]?.data?.metadata as ConversationMetadata,
			};
		},
	});

	return call;
}

interface ConversationMetadata {
	invitation_status: EnumProducerStatus | EnumStatus | EnumStudioStatus;
	last_negotiation_id: UniqueId;
	last_negotiation_status: 'pending' | 'confirmed';
	project_id: UniqueId;
	project_name: string;
	reciever_data: {
		reciever_name: string;
		reciever_id: UniqueId;
		reciever_profile_picture: string;
	};
}
