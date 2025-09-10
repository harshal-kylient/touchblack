import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const fetchPermissions = async () => {
	const response = await server.get(CONSTANTS.endpoints.list_producer_permissions);
	if (!response.data?.success) {
		throw new Error('Failed to fetch studio permissions');
	}
	return response.data;
};

export default function useProducerPermissionsList() {
	return useQuery({
		queryKey: ['useProducerPermissionsList'],
		queryFn: fetchPermissions,
		select: res => res?.data || [],
	});
}
