import CONSTANTS from '@constants/constants';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetVideoTypes() {
	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.video_types);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetVideoTypes'],
		queryFn: getData,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return call;
}
