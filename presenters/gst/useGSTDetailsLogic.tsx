import { useMutation, useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { GSTFormValues } from './schema';
import { useAuth } from '@presenters/auth/AuthContext';

export const useGSTDetailsLogic = (id?: string, role?: string) => {
	const queryClient = useQueryClient();
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	return useMutation({
		mutationFn: async (data: GSTFormValues) => {
			const transformedData = {
				...data,
				state_id: data.state_id.id,
				pincode_id: data.pincode_id.id,
			};

			if (id) {
				const endpoint = role === 'managerTalent' ? CONSTANTS.endpoints.gst_manager_detail(id, talentId) : CONSTANTS.endpoints.gst_detail(id);

				return server.put(endpoint, transformedData);
			} else {
				const endpoint = role === 'managerTalent' ? CONSTANTS.endpoints.gst_manager_details(talentId) : CONSTANTS.endpoints.gst_details;

				return server.post(endpoint, transformedData);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGSTList'] });
		},
	});
};
