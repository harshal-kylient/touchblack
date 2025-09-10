import { useMutation, useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postSearchCount = async () => {
	const response = await server.get(endpoints.search_count);
	return response.data;
};

export const usePostSearchCount = () => {
	return useMutation({
		mutationFn: () => postSearchCount(),
	});
};
