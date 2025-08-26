import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProjectDeal(talent_id: UniqueId, project_id: UniqueId, producer_id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.fetch_project_deal(talent_id, project_id, producer_id));
		return response.data;
	};

	const call = useQuery({
		queryFn: getData,
		queryKey: ['useGetProjectDeal', talent_id, project_id, producer_id],
		select: res => res?.data || [],
	});

	return call;
}
