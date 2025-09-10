import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllStudioBookingsByDate(floorId: UniqueId, dateString: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.list_bookings_by_date(floorId, dateString));
		return response;
	};

	const call = useQuery({
		queryKey: ['useGetAllStudioBookingsByDate', floorId, dateString],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => ({
			data: res.data?.data || [],
			status: res.status,
		}),
	});

	return call;
}
