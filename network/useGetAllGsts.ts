import CONSTANTS from '@constants/constants';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';
import { TalentManagerStorage } from '@utils/storage';

export default function useGetAllGsts(type?: string) {
	const { loginType } = useAuth();
	const { selectedTalent } = useTalentContext();
	const selectedTalentId = selectedTalent?.talent?.user_id;

	const getData = async () => {
		if (loginType === 'manager') {
			const talentId = type === 'talentNotification' ? TalentManagerStorage.getString('requiredTalentId') : selectedTalentId;
			const response = await server.get(CONSTANTS.endpoints.get_all_active_manager_talent_gst(talentId));
			return response.data;
		} else {
			const response = await server.get(CONSTANTS.endpoints.get_all_active_gst);
			return response.data;
		}
	};

	const call = useQuery({
		queryFn: getData,
		queryKey: ['useGetAllGsts'],
		select: res => res?.data || [],
	});

	return call;
}
