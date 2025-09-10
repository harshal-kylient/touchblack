import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllProducerProjectsByDate(dateString: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.list_producer_projects_by_day(dateString));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetAllProducerProjectsByDate', dateString],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data || [],
	});

	return call;
}
