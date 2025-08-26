import CONSTANTS from '@constants/constants';
import { useMutation } from '@tanstack/react-query';
import server from '@utils/axios';

const updateStudioPermissions = async (userId: string, studioId: string, permissions: { [key: string]: boolean }): Promise<void> => {
	const response = await server.post(CONSTANTS.endpoints.manage_studio_access(userId, studioId), { permissions });
	if (!response.data?.success) {
		throw new Error('Failed to update studio permissions');
	}
};

export const useUpdateStudioPermissions = () => {
	return useMutation({
		mutationFn: ({ userId, studioId, permissions }: { userId: string; studioId: string; permissions: { [key: string]: boolean } }) => updateStudioPermissions(userId, studioId, permissions),
	});
};
