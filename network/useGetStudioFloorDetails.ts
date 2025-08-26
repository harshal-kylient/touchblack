import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const useGetStudioFloorDetails = (floorId: string) => {
	return useQuery({
		queryKey: ['studio_floor_details', floorId],
		queryFn: () => server.get(endpoints.studio_floor_details(floorId)),
	});
};

export default useGetStudioFloorDetails;
