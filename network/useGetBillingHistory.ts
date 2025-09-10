import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

const getBillingHistory = async () => {
	const response = await server.get(endpoints.get_billing_history);
	return response.data;
};

export const useGetBillingHistory = () => {
	return useQuery({
		queryKey: ['billingHistory'],
		queryFn: () => getBillingHistory(),
	});
};
