import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetSearchManagers(query: string) {
	const getsearchedManager = async () => {
		const response = await server.get(CONSTANTS.endpoints.search_managers('manager', query));
		return response.data;
	};

	const call = useQuery({
		queryKey: [query],
		queryFn: getsearchedManager,
	});

	return call;
}
