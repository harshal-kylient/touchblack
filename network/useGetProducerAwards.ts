import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function useGetProducerAwards(producerId: UniqueId) {
	const endpoint = CONSTANTS.endpoints.get_producer_awards(producerId);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProducerAwards', producerId],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
