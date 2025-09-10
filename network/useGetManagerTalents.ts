import { useQuery, useMutation } from '@tanstack/react-query';
import endpoints from '../constants/endpoints';
import server from '@utils/axios';

const fetchManagerTalents = async (status: string) => {
	const response = await server.get(endpoints.manager_active_talents(status));
	return response.data;
};

const refetchTalents = (status: string) => async () => {
	const response = await server.get(endpoints.manager_active_talents(status));
	return response.data;
};

export default function useGetManagerTalents(status: string) {
	const { data, isFetching, refetch, isRefetching } = useQuery({
		queryKey: ['managerTalents', status],
		queryFn: () => fetchManagerTalents(status),
		enabled: Boolean(status),
	});

	const { mutate } = useMutation({
		mutationFn: refetchTalents(status),
		mutationKey: ['managerTalents', status],
	});

	return {
		data,
		isFetching,
		mutate,
		refetch,
		isRefetching,
	};
}
