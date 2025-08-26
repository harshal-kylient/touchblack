import CONSTANTS from '@constants/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';

interface TeamMember {
	id: string;
}

interface AddTeamMemberResponse {
	success: boolean;
	data: TeamMember;
}

const addTeamMember = async (userId: string): Promise<AddTeamMemberResponse> => {
	const response = await server.post(CONSTANTS.endpoints.add_producer_team_member(userId));
	return response.data;
};

export const useAddProducerTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId }: { userId: string }) => addTeamMember(userId),
		onSuccess: () => {
			queryClient.invalidateQueries('useGetTeamMembers');
		},
		onError: err => {
			return err;
		},
	});
};
