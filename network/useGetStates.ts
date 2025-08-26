import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetStates() {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.states(CONSTANTS.INDIA_ID));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetStates', CONSTANTS.INDIA_ID],
		queryFn: getAllData,
	});

	return call;
}
