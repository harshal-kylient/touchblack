import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postEventsInterest = async (id: string) => {
	const response = await server.post(endpoints.event_interested(id));
	return response.data;
};

export const usePostEventInterest = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => postEventsInterest(id),
	});
};
