import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postSubscriptionInitiate = async (subsId: UniqueId, stateId: string, autoPay: string, gstId?: { stateId: string; id: string; name: string }) => {
	const requestData: Record<string, any> = {
		subscription_plan_id: subsId,
		state_id: stateId,
		auto_pay: autoPay,
	};

	if (gstId) {
		requestData.gst_detail_id = gstId?.id;
	}

	const response = await server.post(endpoints.subscription_initiate, requestData);
	return response.data;
};

export const useSubscriptionInitiate = () => {
	return useMutation({
		mutationFn: ({ subsId, stateId, gstId, autoPay }: { subsId: UniqueId; stateId: string; gstId?: string; autoPay: string }) => postSubscriptionInitiate(subsId, stateId, autoPay, gstId),
	});
};
