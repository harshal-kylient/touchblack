import CONSTANTS from '@constants/constants';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import { useInfiniteQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetStudioBookings(floorId: UniqueId, status: EnumStudioStatus, enabled: boolean = true) {
	const getAllData = async ({ pageParam }: { pageParam: number }) => {
		const response = await server.get(CONSTANTS.endpoints.studio_floor_bookings(floorId, status));
		if (!response.data?.success) {
			return {
				status: 200,
				data: {
					message: 'No Booking found',
					success: false,
					data: [],
				},
			};
		}
		return response;
	};

	const call = useInfiniteQuery({
		queryKey: ['useGetStudioBookings', floorId, status],
		queryFn: getAllData,
		initialPageParam: 1,
		enabled,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.data?.success || !lastPage.data?.data || lastPage.data?.data?.length < 10) {
				return undefined;
			}
			return allPages.length + 1;
		},
		select: res => ({
			status: res?.pages?.[0]?.status,
			data: res?.pages?.flatMap(page => page.data?.data) || [],
		}),
	});

	return call;
}
