import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetFollowingStatus(user_id: string) {
	async function getFollowingStatus() {
		const response = await server.get(CONSTANTS.endpoints.followingStatus(user_id));
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetFollowingStatus', user_id],
		queryFn: getFollowingStatus,
		enabled: !!user_id,
	});

	return call;
}
