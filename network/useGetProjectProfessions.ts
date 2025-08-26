import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';
import EnumStatus from '@models/enums/EnumStatus';

export default function useGetProjectProfessions(projectId: UniqueId, status: EnumStatus) {
	const endpoint = CONSTANTS.endpoints.project_professions(projectId, status);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProjectProfessions', projectId, status],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
