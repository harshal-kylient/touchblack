import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetProducerCalendarList(year_month: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.producer_calendar(year_month));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetProducerCalendarList', year_month],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data || [],
	});

	return call;
}
