import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetFollowingStats(user_id:string) {
	async function getFollowingStats() {
		const response = await server.get(CONSTANTS.endpoints.followingStats(user_id));
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetFollowingStats', user_id],
		queryFn: getFollowingStats,
		enabled: !!user_id, 
	});

	return call;
}