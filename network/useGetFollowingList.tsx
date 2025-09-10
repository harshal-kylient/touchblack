import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetFollowingList(user_id: string, heading: string) {
	async function getFollowingList() {
		const endpoint = heading?.toLowerCase() === 'followers' ? CONSTANTS.endpoints.followersList(user_id) : CONSTANTS.endpoints.followingList(user_id);
		const response = await server.get(endpoint);
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetFollowingList', user_id, heading],
		queryFn: getFollowingList,
		enabled: !!user_id,
	});

	return call;
}
