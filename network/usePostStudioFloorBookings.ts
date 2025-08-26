// {
//     "studio_floor_id": "afadd04f-36fa-455e-bf67-1e51db237daf",
//     "producer_id": "723b75f1-e2ad-4392-b3e0-4c6db930bd60",
//     "project_id": "58b79825-dbc8-410a-9d1c-53fe1e647e5b",
//     "dates": [
//       "2024-10-01"
//     ],
//     "start_time": "10:00",
//     "end_time": "12:00"
//   }

import { useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const postStudioFloorBookings = async (data: any) => {
	const response = await server.post(endpoints.post_studio_floor_bookings, data);
	return response.data;
};

export const usePostStudioFloorBookings = (data: any) => {
	const { mutate, isPending } = useMutation({
		mutationFn: () => postStudioFloorBookings(data),
	});
	return { mutate, isPending };
};
