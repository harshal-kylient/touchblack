import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const fetchStudioPermissions = async (userId: UniqueId, studioId: UniqueId) => {
	const response = await server.get(CONSTANTS.endpoints.list_studio_permissions(userId, studioId));
	if (!response.data?.success) {
		throw new Error('Failed to fetch studio permissions');
	}
	return response.data.data;
};

export const useStudioPermissions = (userId: UniqueId, studioId: UniqueId) => {
	return useQuery({
		queryKey: ['studioPermissions', userId, studioId],
		queryFn: () => fetchStudioPermissions(userId, studioId),
	});
};
