import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const setAutopayStatus = async ({ subscriptionId, status }: { subscriptionId: string; status: string }) => {
	const response = await server.patch(`${endpoints.auto_pay_status}/${subscriptionId}`, {
		auto_pay_status: status,
	});
	return response.data;
};

export const useSetAutoPayStatus = () => {
	return useMutation({
		mutationFn: setAutopayStatus,
	});
};
