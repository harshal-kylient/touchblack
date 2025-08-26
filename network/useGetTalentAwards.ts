import CONSTANTS from '@constants/constants';
import server from '@utils/axios';
import { useQuery } from '@tanstack/react-query';

export default function useGetTalentAwards(talentId: UniqueId) {
	const endpoint = CONSTANTS.endpoints.talent_awards(talentId);
	const getData = async () => {
		const response = await server.get(endpoint);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetTalentAwards', talentId],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
	return call;
}
