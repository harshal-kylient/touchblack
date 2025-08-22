import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProjectDetails(projectId: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.project_details(projectId));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProjectDetails', projectId],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data,
	});
	return call;
}
