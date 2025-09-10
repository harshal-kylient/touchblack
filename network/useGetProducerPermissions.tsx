import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const fetchPermissions = async (userId: UniqueId) => {
	const response = await server.get(CONSTANTS.endpoints.fetch_producer_permissions(userId));
	if (!response.data?.success) {
		throw new Error('Failed to fetch studio permissions');
	}
	return response.data.data;
};

export const useGetProducerPermissions = (userId: UniqueId) => {
	return useQuery({
		queryKey: ['useGetProducerPermissions', userId],
		queryFn: () => fetchPermissions(userId),
	});
};
