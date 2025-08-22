import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

export const usePatchStudioFloorBookingStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ studio_floor_booking_id, status }: { studio_floor_booking_id: string; status: string }) => {
			const response = await server.patch(CONSTANTS.endpoints.update_studio_floor_booking_status, {
				studio_floor_booking_id,
				status,
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['studio_floor_bookings'] });
		},
	});
};
