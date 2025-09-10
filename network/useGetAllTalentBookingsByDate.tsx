import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetAllTalentBookingsByDate(talentId: UniqueId, dateString: string) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.list_data_by_date(talentId, dateString));
		return response;
	};

	const call = useQuery({
		queryKey: ['useGetAllTalentBookingsByDate', talentId, dateString],
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
