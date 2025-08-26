import CONSTANTS from '@constants/constants';
import { useMutation } from '@tanstack/react-query';
import server from '@utils/axios';
import { useQueryClient } from '@tanstack/react-query';

const removeTeamMember = async (userId: string): Promise<void> => {
	const response = await server.post(CONSTANTS.endpoints.remove_producer_team_member(userId));
	if (!response.data?.success) {
		throw new Error('Failed to remove producer team member');
	}
};

export const useRemoveProducerTeamMember = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId }: { userId: string }) => removeTeamMember(userId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ['studioTeamMembers', variables.userId] });
			queryClient.invalidateQueries({ queryKey: ['useGetProducerPermission', variables.userId] });
		},
		onError: error => {},
	});
};
