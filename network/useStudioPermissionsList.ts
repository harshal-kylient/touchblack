import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

const fetchStudioPermissionsList = async (studioId: UniqueId) => {
	const response = await server.get(CONSTANTS.endpoints.studio_access_permission_list(studioId));
	if (!response.data?.success) {
		throw new Error('Failed to fetch studio permissions list');
	}
	return response.data.data;
};

export const useStudioPermissionsList = (studioId: UniqueId) => {
	return useQuery({
		queryKey: ['studioPermissionsList', studioId],
		queryFn: () => fetchStudioPermissionsList(studioId),
	});
};
