import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const getSubscriptionCurrentStatus = async () => {
	const response = await server.get(endpoints.subscription_current_status);
	return response.data;
};

export const useGetSubscriptionCurrentStatus = () => {
	return useQuery({
		queryKey: ['subscriptionCurrentStatus'],
		queryFn: () => getSubscriptionCurrentStatus(),
	});
};
