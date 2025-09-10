import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

export default function useGetGSTDetails(id: string | undefined, role: string) {
	const { loginType, managerTalentId } = useAuth();
	const talentId = loginType === 'manager' ? managerTalentId : '';
	return useQuery({
		queryKey: ['useGetGSTDetails', id],
		queryFn: async () => {
			if (!id) {
				return null;
			}
			let url = CONSTANTS.endpoints.gst_detail(id);

			if (role === 'managerTalent' && talentId) {
				url += `?talent_id=${talentId}`;
			}

			const response = await server.get(url);
			return response.data;
		},
		enabled: !!id,
	});
}
