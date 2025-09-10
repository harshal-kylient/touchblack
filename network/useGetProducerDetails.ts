import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function useGetProducerDetails(id: UniqueId) {
	const endpoint = CONSTANTS.endpoints.producer_about(id!);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetUserDetailsById', 'Producer', id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
