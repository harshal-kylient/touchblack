import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProjectStudiosList(project_id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.list_booked_studio_floors(project_id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProjectStudiosList', project_id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data,
	});

	return call;
}
