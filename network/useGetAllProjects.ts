/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '@presenters/auth/AuthContext';
import useGetProducerProjects from './useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import useGetTalentProjects from './useGetTalentProjects';
import useGetManagerProjects from './useGetManagerProjects';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

export default function useGetAllProjects(query?: string) {
	const { loginType } = useAuth();
	const { selectedTalent } = useTalentContext();
	const userId = selectedTalent?.talent?.user_id;
	if (loginType === 'producer') {
		return useGetProducerProjects(EnumProducerStatus.All, true, query);
	} else if (loginType === 'manager') {
		return useGetManagerProjects(userId, '', true, query);
	} else {
		return useGetTalentProjects('', true, query);
	}
}
