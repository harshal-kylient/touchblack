import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetStudioFloorPricingByVideoTypeId(video_type_id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.studio_floor_pricing_by_video_type(video_type_id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetStudioFloorPricingByVideoTypeId', video_type_id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => ({ data: res?.data?.shoot_type_pricing_list || [], tnc_url: res?.data?.terms_and_conditions_url }),
	});

	return call;
}
