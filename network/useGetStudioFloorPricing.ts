import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetStudioFloorPricing(studio_id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.studio_floor_pricing(studio_id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetStudioFloorPricing', studio_id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data || [],
	});

	return call;
}
