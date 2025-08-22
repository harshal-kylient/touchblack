import CONSTANTS from '@constants/constants';
import { useMutation } from '@tanstack/react-query';
import server from '@utils/axios';
import { useQueryClient } from '@tanstack/react-query';

const removeStudioTeamMember = async (userId: string, studioId: string): Promise<void> => {
	const response = await server.post(CONSTANTS.endpoints.remove_studio_team_member(userId, studioId));
	if (!response.data?.success) {
		throw new Error('Failed to remove studio team member');
	}
};

export const useRemoveStudioTeamMember = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, studioId }: { userId: string; studioId: string }) => removeStudioTeamMember(userId, studioId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['studioTeamMembers', variables.studioId] });
			queryClient.invalidateQueries({ queryKey: ['studioPermissions', variables.studioId] });
		},
		onError: error => {},
	});
};
