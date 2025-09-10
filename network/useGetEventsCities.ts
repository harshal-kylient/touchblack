import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetEventsCitiesList() {
	async function getCitiesList() {
		const endpoint = CONSTANTS.endpoints.event_cities
		const response = await server.get(endpoint);
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetEventsCitiesList'],
		queryFn: getCitiesList,
	});

	return call;
}