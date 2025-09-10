import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { PanCardFormValues } from '@presenters/panCard/schema';

interface PanCardResponse {
	id: string;
	proof_number: string;
	name: string;
	proof_type: string;
}

const fetchPanCardDetails = async (userId: string, proofType: string): Promise<PanCardResponse | null> => {
	try {
		const response = await server.get(CONSTANTS.endpoints.fetch_user_identity_proof_by_type(userId, proofType));
		// Return null if proof not found instead of throwing error
		if (response.status === 404) {
			return null;
		}
		if (!response.data?.success) {
			throw new Error(response.data.message);
		}
		return response.data.data;
	} catch (error: any) {
		// Handle 404 specifically
		if (error.response?.status === 404) {
			return null;
		}
		throw error;
	}
};

const updatePanCardDetails = async ({ userId, proofId, data }: { userId: string; proofId: string; data: PanCardFormValues }): Promise<PanCardResponse> => {
	const response = await server.put(CONSTANTS.endpoints.update_user_identity_proof(userId, proofId), data);
	if (!response.data?.success) {
		throw new Error(response.data?.data?.proof_number?.[0] || response.data.message || 'Failed to update PAN card details');
	}
	return response.data.data;
};

const createPanCardDetails = async ({ userId, data }: { userId: string; data: PanCardFormValues }): Promise<PanCardResponse> => {
	const response = await server.post(CONSTANTS.endpoints.create_user_identity_proof(userId), data);
	if (!response.data?.success) {
		throw new Error(response.data.message || 'Failed to create PAN card details');
	}
	return response.data.data;
};

export const usePanCardDetails = (userId: string, proofType: string) => {
	const queryClient = useQueryClient();
	const queryKey = ['panCardDetails', userId, proofType];

	const { data, error, isLoading } = useQuery({
		queryKey,
		queryFn: () => fetchPanCardDetails(userId, proofType),
		// Only fetch if we have a userId
		enabled: Boolean(userId),
	});

	const updateMutation = useMutation({
		mutationFn: updatePanCardDetails,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const createMutation = useMutation({
		mutationFn: createPanCardDetails,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	return {
		data,
		error,
		isLoading,
		updatePanCardDetails: updateMutation.mutateAsync,
		createPanCardDetails: createMutation.mutateAsync,
		isUpdating: updateMutation.isPending,
		isCreating: createMutation.isPending,
	};
};
