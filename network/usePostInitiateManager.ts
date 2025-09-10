import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postManagerInitiate = async (managerId: string, invoiceStatus: boolean) => {
	const requestData: Record<string, any> = {
		manager_id: managerId,
		permissions: [{ name: 'ManagerTalent::UseManagerGSTINForInvoices', active: invoiceStatus }],
	};

	const response = await server.post(endpoints.intiateAssignManager, requestData);
	return response.data;
};

export const useManagerInitiate = () => {
	return useMutation({
		mutationFn: ({ managerId, invoiceStatus }: { managerId: string; invoiceStatus: boolean }) => postManagerInitiate(managerId, invoiceStatus),
	});
};
