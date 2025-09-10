import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const getManagerStatus = async () => {
	const response = await server.get(endpoints.getActiveManager);
	return response.data;
};

export const useGetManagerStatus = () => {
	return useQuery({
		queryKey: ['managerStatus'],
		queryFn: () => getManagerStatus(),
	});
};
