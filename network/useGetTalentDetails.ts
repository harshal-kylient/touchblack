import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function useGetTalentDetails(id: UniqueId) {
	const endpoint = CONSTANTS.endpoints.talent_about(id!);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetUserDetailsById', 'User', id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
