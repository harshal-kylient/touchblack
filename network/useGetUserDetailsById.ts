import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetUserDetailsById(type: 'User' | 'Producer', id: UniqueId) {
	const endpoint = type === 'User' ? CONSTANTS.endpoints.talent_about(id) : CONSTANTS.endpoints.producer_about(id);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetUserDetailsById', type, id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data,
	});

	return call;
}
