import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetFilmDetails(id: UniqueId) {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.film_details(id));
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetFilmDetails', id],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		select: res => res?.data,
	});

	return call;
}
