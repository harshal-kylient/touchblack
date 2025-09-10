import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

async function getData() {
	const response = await server.get(CONSTANTS.endpoints.projects_count);
	return response.data;
}

export default function useGetProjectsCount() {
	const call = useQuery({
		queryKey: ['useGetProjectsCount'],
		queryFn: getData,
	});

	return call;
}
