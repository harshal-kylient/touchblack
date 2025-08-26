import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

const getSubscriptionDetails = async (params: Record<string, any>) => {
	const response = await server.get(CONSTANTS.endpoints.get_subscriptions, { params });
	return response.data;
};

const useGetSubscriptionDetails = ({ active, status, subscription_type }: { active?: boolean; status?: string; subscription_type?: string }) => {
	const params: Record<string, any> = {};

	if (active !== undefined) params.active = active;
	if (status !== undefined) params.status = status;
	if (subscription_type !== undefined) params.subscription_type = subscription_type;

	return useQuery({
		queryKey: ['subscriptionDetails', params],
		queryFn: () => getSubscriptionDetails(params),
	});
};

export default useGetSubscriptionDetails;
