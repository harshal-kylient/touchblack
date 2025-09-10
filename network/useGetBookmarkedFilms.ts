import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetBookmarkedFilms(blackbook_id: UniqueId) {
	const getAllData = async () => {
		const response = await server.get(CONSTANTS.endpoints.search_blackbook_by_blackbook_id(blackbook_id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetBookmarkedFilms', blackbook_id],
		queryFn: getAllData,
	});

	return call;
}
