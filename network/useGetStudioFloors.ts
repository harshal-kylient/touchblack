import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@presenters/auth/AuthContext';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

const getStudioFloors = async (studioId: UniqueId) => {
	const response = await server.get(CONSTANTS.endpoints.fetch_studio_floors(studioId));
	return response.data;
};

const useGetStudioFloors = () => {
	const { studioId } = useAuth();

	return useQuery({
		queryKey: ['studio_floors', studioId],
		queryFn: () => getStudioFloors(studioId!),
		enabled: !!studioId,
		select: res => res?.data || [],
	});
};

export default useGetStudioFloors;
