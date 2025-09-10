import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetStudioCalendarList(floorId: UniqueId, year_month: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.studio_calendar(floorId, year_month));
		return response;
	};

	const call = useQuery({
		queryKey: ['useGetStudioCalendarList', floorId, year_month],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => ({ data: res.data?.data || [], status: res.status }),
	});

	return call;
}
