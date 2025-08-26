import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';

export function useCancelSubscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			try {
				const response = await server.delete(CONSTANTS.endpoints.cancel_subscriptions(id));
				return response.data;
			} catch (error: any) {
				console.error('Error canceling subscription:', error?.response?.data || error.message);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useCancelSubscription'] });
		},
		onError: error => {
			console.error('Mutation error:', error);
		},
	});
}
