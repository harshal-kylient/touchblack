import CONSTANTS from '@constants/constants';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { useAuth } from '@presenters/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import server from '@utils/axios';

export default function useGetBlackoutDates(year: string) {
	const { selectedTalent } = useTalentContext();
	const { loginType } = useAuth();
	const talent_id = selectedTalent?.talent?.user_id;
	const getAllData = async () => {
		let url = CONSTANTS.endpoints.list_talent_blocked_dates(year);

		if (loginType === 'manager') {
			url += `&talent_id=${talent_id}`;
		}
		const response = await server.get(url);
		return response.data;
	};

	const call = useQuery({
		queryKey: ['useGetBlackoutDates', year],
		queryFn: getAllData,
	});

	return call;
}
