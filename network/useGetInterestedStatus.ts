import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetInterestedStatus(event_id: string) {
	async function getInterestedStatus() {
		const response = await server.get(CONSTANTS.endpoints.event_interested_status(event_id));
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetInterestedStatus', event_id],
		queryFn: getInterestedStatus,
		enabled: !!event_id,
	});

	return call;
}
