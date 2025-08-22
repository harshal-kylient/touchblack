import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetSearchResult(activeTab: number, query: string) {
	const endpoint = activeTab === 0 ? (pageParam: number) => CONSTANTS.endpoints.search('user', query, pageParam) : activeTab === 1 ? (pageParam: number) => CONSTANTS.DOMAIN + '/api/v2/' + CONSTANTS.endpoints.search('film', query, pageParam) : (pageParam: number) => CONSTANTS.endpoints.search('producer', query, pageParam);
	const key = activeTab === 0 ? 'useGetSearchedTalents' : activeTab === 1 ? 'useGetSearchedFilms' : 'useGetSearchedProducers';

	const getAllData = async () => {
		if (!query) {
			return;
		}
		const response = await server.get(endpoint(1));
		return response.data;
	};

	const call = useQuery({
		queryKey: [key, query],
		queryFn: getAllData,
		enabled: !!query,
	});

	return call;
}
