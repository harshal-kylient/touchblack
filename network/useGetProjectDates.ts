import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';

export default function useGetProjectDates(projectId: UniqueId, professionId: UniqueId) {
	const endpoint = CONSTANTS.endpoints.project_invitation_dates(projectId, professionId);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProjectDates', projectId, professionId],
		queryFn: getData,
		enabled: !!professionId,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
