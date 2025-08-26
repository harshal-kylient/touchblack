import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const useGetStudioFloorImages = (floorId: string) => {
	return useQuery({
		queryKey: ['studio_floor_list_photos', floorId],
		queryFn: () => server.get(endpoints.studio_floor_list_photos(floorId)),
	});
};

export default useGetStudioFloorImages;
