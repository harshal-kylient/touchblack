import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postFollowUser = async (user_id: string) => {
	const requestData: Record<string, any> = {
		user_id: user_id,
	};
	const response = await server.post(endpoints.followUser, requestData);
	return response.data;
};

export const useFollowUser = () => {
	return useMutation({
		mutationFn: ({ user_id }: { user_id: string }) => postFollowUser(user_id),
	});
};
