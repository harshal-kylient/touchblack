import CONSTANTS from '@constants/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';

interface AddStudioTeamMemberResponse {
	success: boolean;
	data: StudioTeamMember;
}

interface StudioTeamMember {
	id: string;
}

const addStudioTeamMember = async (userId: string, studioId: string): Promise<AddStudioTeamMemberResponse> => {
	const response = await server.post(CONSTANTS.endpoints.add_studio_team_member(userId, studioId));
	return response.data;
};

export const useAddStudioTeamMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, studioId }: { userId: string; studioId: string }) => addStudioTeamMember(userId, studioId),
		onSuccess: (data, variables) => {
			// Update the cache with the new team member
			queryClient.setQueryData<StudioTeamMember[]>(['studioTeam', variables.studioId], oldData => {
				return oldData ? [...oldData, data.data] : [data.data];
			});
		},
		onError: (error: unknown) => {
			return error;
		},
	});
};
