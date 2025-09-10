import { useAuth } from '@presenters/auth/AuthContext';
import useGetProducerCalendarList from './useGetProducerCalendarList';
import useGetTalentCalendarList from './useGetTalentCalendarList';
import EnumStatus from '@models/enums/EnumStatus';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

export default function useGetProjectsCalendarList(formattedMonthYear: string, talent_id?: UniqueId) {
	const { loginType } = useAuth();
	const { selectedTalent } = useTalentContext();
	const userID = loginType === 'manager' ? selectedTalent?.talent?.user_id : talent_id;
	if (loginType === 'producer') {
		const { data: producer_projects } = useGetProducerCalendarList(formattedMonthYear);
		const producerMarkedDates = producer_projects?.reduce((acc, { date, completed, live }) => {
			acc[date] = {
				completedCount: completed,
				liveCount: live,
				totalCount: completed + live,
				confirmedCount: 0,
				enquiryCount: 0,
				blackoutCount: 0,
			};
			return acc;
		}, {});

		return producerMarkedDates;
	} else {
		const { data: talent_projects } = useGetTalentCalendarList(userID!, formattedMonthYear);
		const talentMarkedDates = transformTalentCalendarResponse(talent_projects);
		return talentMarkedDates;
	}
}

function transformTalentCalendarResponse(response: any) {
	const result: any = {};

	for (const date in response) {
		const counts = {
			completedCount: 0,
			liveCount: 0,
			totalCount: 0,
			confirmedCount: 0,
			enquiryCount: 0,
			blackoutCount: 0,
		};

		response[date]?.forEach(project => {
			counts.totalCount++;

			if (project.status === EnumStatus.Enquiry) {
				counts.enquiryCount++;
			}

			if (project.status === EnumStatus.Confirmed) {
				counts.confirmedCount++;
			}

			if (project.status === EnumStatus.Not_available) {
				counts.blackoutCount++;
			}
		});
		result[date] = counts;
	}

	return result;
}
