import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetBlackbookDataInOrder() {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.get_ordered_blackbook_data);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetBlackbookDataInOrder'],
		queryFn: getAllData,
	});

	return call;
}
