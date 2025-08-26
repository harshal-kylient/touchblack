import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const getSubscriptionPlans = async () => {
	const response = await server.get(endpoints.subscription_plans);
	return response.data;
};

export const useGetSubscriptionPlans = () => {
	return useQuery({
		queryKey: ['subscriptionPlans'],
		queryFn: () => getSubscriptionPlans(),
	});
};
