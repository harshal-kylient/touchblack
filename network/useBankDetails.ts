import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { BankDetailsFormValues } from '@presenters/bankDetails/schema';

interface BankDetail {
	id: string;
	account_number: string;
	account_holder_name: string;
	account_type: string;
	admin_bank_ifsc_id: string;
	bank_ifsc: string;
	black_enum_id: string;
}

const fetchBankDetails = async (userId: string): Promise<BankDetail[]> => {
	if (!userId) {
		return [];
	}

	const response = await server.get(CONSTANTS.endpoints.list_bank_details(userId));
	if (!response.data?.success) {
		throw new Error('Failed to fetch bank details');
	}

	return response.data.data || [];
};

const updateBankDetails = async ({ userId, bankId, data }: { userId: string; bankId: string; data: { user_bank_detail: Partial<BankDetailsFormValues> } }) => {
	if (!bankId) {
		throw new Error('Bank ID is required for updating bank details');
	}

	const response = await server.patch(CONSTANTS.endpoints.update_bank_detail(userId, bankId), data);

	if (!response.data?.success) {
		throw new Error(response.data?.data?.message || 'Failed to update bank details');
	}

	return response.data.data;
};

const createBankDetails = async ({ userId, data }: { userId: string; data: { user_bank_detail: Partial<BankDetailsFormValues> } }) => {
	const response = await server.post(CONSTANTS.endpoints.create_bank_detail(userId), data);

	if (!response.data?.success) {
		throw new Error('Failed to create bank details');
	}

	return response.data.data;
};

export const useBankDetails = (userId: string, blackEnumId: string) => {
	const queryClient = useQueryClient();

	const { data, error, isLoading } = useQuery({
		queryKey: ['bankDetails', userId, blackEnumId],
		queryFn: () => fetchBankDetails(userId),
		enabled: Boolean(userId) && Boolean(blackEnumId),
	});

	const updateMutation = useMutation({
		mutationFn: updateBankDetails,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['bankDetails', userId, blackEnumId],
			});
		},
		onError: (error: any) => {
			throw error;
		},
	});

	const createMutation = useMutation({
		mutationFn: createBankDetails,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['bankDetails', userId, blackEnumId],
			});
		},
		onError: (error: any) => {
			throw error;
		},
	});

	return {
		data,
		error,
		isLoading,
		updateBankDetails: updateMutation.mutateAsync,
		createBankDetails: createMutation.mutateAsync,
	};
};
