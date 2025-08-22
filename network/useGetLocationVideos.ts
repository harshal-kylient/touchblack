import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetLocationVideos(studio_floor_id: UniqueId) {
	async function getData() {
		const response = await server.get(CONSTANTS.endpoints.location_videos(studio_floor_id));
		return response.data;
	}

	const call = useQuery({
		queryKey: ['useGetLocationVideos', studio_floor_id],
		queryFn: getData,
	});

	return call;
}
