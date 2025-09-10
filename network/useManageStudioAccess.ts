import CONSTANTS from '@constants/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';

interface ManageStudioAccessParams {
	userId: UniqueId;
	studioId: UniqueId;
	permissions: string[];
}

interface ManageStudioAccessResponse {
	success: boolean;
	message: string;
}

const manageStudioAccess = async ({ userId, studioId, permissions }: ManageStudioAccessParams): Promise<ManageStudioAccessResponse> => {
	const response = await server.postForm(CONSTANTS.endpoints.manage_studio_access(studioId), { user_id: userId, permission_ids: permissions });
	return response.data;
};

export const useManageStudioAccess = () => {
	const queryClient = useQueryClient();

	return useMutation<ManageStudioAccessResponse, Error, ManageStudioAccessParams>({
		mutationFn: manageStudioAccess,
		onSuccess: (data, variables) => {
			// Invalidate and refetch relevant queries
			queryClient.invalidateQueries({ queryKey: ['studioPermissions', variables.studioId] });
			queryClient.invalidateQueries({ queryKey: ['studioTeamMembers', variables.studioId] });
		},
		onError: error => {
			return error;
		},
	});
};
