import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

const removeManager = async (id: string) => {
	const response = await server.delete(CONSTANTS.endpoints.remove_manager(id));
	return response.data;
};

export const useRemoveManager = () => {
	return useMutation({
		mutationFn: ({ id }: { id: string }) => removeManager(id),
	});
};
