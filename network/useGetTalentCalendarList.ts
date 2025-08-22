import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetTalentCalendarList(talent_id: UniqueId, year_month: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.talent_calendar(talent_id, year_month));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetTalentCalendarList', talent_id, year_month],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data || {},
	});

	return call;
}
