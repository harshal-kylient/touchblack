import { useQuery } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const fetchStudioFloorBookings = async ({ studio_floor_id, status }: { studio_floor_id: string | null | undefined; status?: 'enquiry' | 'tentative' | 'confirmed' }) => {
	if (!studio_floor_id) {
		return null;
	}
	const response = await server.get(endpoints.fetch_studio_floor_bookings, {
		params: {
			studio_floor_id,
			status,
			upcoming_days: 15,
		},
	});
	return response.data;
};

export const useGetStudioFloorBookings = ({ studio_floor_id, activeTab }: { studio_floor_id: string | null | undefined; activeTab: 'enquiry' | 'tentative' | 'confirmed' }) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['studio_floor_bookings', studio_floor_id, activeTab],
		queryFn: () =>
			fetchStudioFloorBookings({
				studio_floor_id,
				status: activeTab,
			}),
	});
	return { data, isLoading, error };
};
