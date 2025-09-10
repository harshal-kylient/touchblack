import CONSTANTS from '@constants/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';

interface ManageAccessParams {
	userId: UniqueId;
	permissions: string[];
}

interface ManageAccessResponse {
	success: boolean;
	message: string;
}

const manageAccess = async ({ userId, permissions }: ManageAccessParams): Promise<ManageAccessResponse> => {
	const response = await server.post(CONSTANTS.endpoints.manage_producer_access, { user_id: userId, permission_ids: permissions });
	return response.data;
};

export default function useManageProducerAccess() {
	const queryClient = useQueryClient();

	return useMutation<ManageAccessResponse, Error, ManageAccessParams>({
		mutationFn: manageAccess,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['useGetProducerPermissions', variables.userId] });
		},
		onError: error => {
			return error;
		},
	});
}
