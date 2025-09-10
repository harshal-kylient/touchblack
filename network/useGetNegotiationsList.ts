import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetNegotiationsList(conversation_id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.list_negotiations(conversation_id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetNegotiationsList', conversation_id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data || [],
	});

	return call;
}
