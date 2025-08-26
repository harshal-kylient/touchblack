import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQuery, useQueryClient, UseQueryResult, useMutation } from '@tanstack/react-query';
import server from '@utils/axios';

export interface GSTDetail {
	id: string;
	user_id: string;
	gstin: string;
	legal_name: string;
	address: string;
	state_id: string;
	pincode_id: string;
	status: string;
	created_at: string;
	updated_at: string;
}

interface GSTResponse {
	message: string;
	success: boolean;
	data: GSTDetail[];
}

export default function useGSTList(role?: string, talentId?: string): UseQueryResult<GSTResponse, Error> {
	const getAllData = async (): Promise<GSTResponse> => {
		let url = CONSTANTS.endpoints.gst_details;

		if (role === 'managerTalent' && talentId) {
			url += `?talent_id=${talentId}`;
		}

		const response = await server.get<GSTResponse>(url);
		return response.data;
	};

	return useQuery<GSTResponse, Error>({
		queryKey: ['useGSTList', role, talentId],
		queryFn: getAllData,
	});
}

export function useDeleteGSTDetail(role: string) {
	const queryClient = useQueryClient();
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	return useMutation({
		mutationFn: async (id: string) => {
			let url = CONSTANTS.endpoints.gst_detail(id);

			if (role === 'managerTalent' && talentId) {
				url += `?talent_id=${talentId}`;
			}

			const response = await server.delete(url);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGSTList'] });
		},
		onError: error => {
			throw error;
		},
	});
}
