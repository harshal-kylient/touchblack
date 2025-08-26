import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CONSTANTS from '@constants/constants';
import server from '@utils/axios';

export default function useGetStudioFloorBlockedDates(floorId: UniqueId) {
	const queryClient = useQueryClient();

	const getData = async () => {
		const response = await server.get(CONSTANTS.endpoints.studio_floor_list_blocked_dates(floorId));
		return response.data;
	};

	const addBlockedDate = async (data: unknown) => {
		const response = await server.post(CONSTANTS.endpoints.studio_floor_block_dates(floorId), data);
		return response.data;
	};

	const query = useQuery({
		queryKey: ['useGetStudioFloorBlockedDates', floorId],
		queryFn: getData,
		enabled: !!floorId,
	});

	const mutation = useMutation({
		mutationFn: addBlockedDate,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetStudioFloorBlockedDates', floorId] });
		},
	});

	return {
		...query,
		addBlockedDate: mutation.mutate,
		isAddingBlockedDate: mutation.isPending,
		addBlockedDateError: mutation.error,
	};
}
