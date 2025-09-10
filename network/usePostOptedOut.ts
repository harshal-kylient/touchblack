import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postOptedOut = async (id: string) => {
	const response = await server.post(endpoints.event_optout(id));
	return response.data;
};

export const usePostOptedOut = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => postOptedOut(id),
	});
};
