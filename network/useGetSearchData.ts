import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetSearchData(query: string, type: 'USER' | 'FILM' | 'PRODUCER') {
	const getAllData = async () => {
		const endpoint = type === 'FILM' ? CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search(type.toLowerCase(), query) : CONSTANTS.endpoints.search(type.toLowerCase(), query);
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetSearchData', type, query],
		queryFn: getAllData,
	});

	return call;
}
