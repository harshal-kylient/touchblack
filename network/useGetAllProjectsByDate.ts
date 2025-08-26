import { useAuth } from '@presenters/auth/AuthContext';
import useGetAllProducerProjectsByDate from './useGetAllProducerProjectsByDate';
import useGetAllTalentProjectsByDate from './useGetAllTalentProjectsByDate';

export default function useGetAllProjectsByDate(year_month: string, dateString: string) {
	const { loginType, userId } = useAuth();

	if (loginType === 'producer') {
		const data = useGetAllProducerProjectsByDate(dateString);
		return data?.data;
	} else {
		const data = useGetAllTalentProjectsByDate(userId!, year_month, dateString);
		return transform(data, []);
	}
}

// TODO: backend cleanup
function transform(data, defaultValue) {
	if (!data) return defaultValue;
	return data?.map(it => ({
		...it,
		id: it?.project_id,
	}));
}
