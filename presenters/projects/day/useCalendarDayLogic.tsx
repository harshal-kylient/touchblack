import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import useGetTalentCalendarList from '@network/useGetTalentCalendarList';
import transformTalentCalendarResponse from '@utils/transformTalentCalendarResponse';
import { DateData } from 'react-native-calendars';
import EnumStatus from '@models/enums/EnumStatus';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

export const useCalendarDayLogic = (date: DateData, marking: any) => {
	const { loginType, userId } = useAuth();
	const { selectedTalent } = useTalentContext();
	const userID = loginType === 'manager' ? selectedTalent?.talent?.user_id : userId;
	const { data: talent_projects } = useGetTalentCalendarList(userID!, `${date.year}-${String(date.month).padStart(2, '0')}`);
	const data = transformTalentCalendarResponse(talent_projects);

	const isTalentOrManager = loginType === 'talent' || loginType === 'manager';
	const userType = capitalized(isTalentOrManager ? 'User' : loginType!);

	const isDateBlocked = data[date.dateString]?.blackoutCount > 0;

	const getStatus = (isBlocked: boolean, counts: { [key: string]: number }) => {
		if (isBlocked && isTalentOrManager) {
			return EnumStatus.Blocked;
		}
		if (counts.completed > 0 && counts.live > 0) {
			return 'Both';
		}
		if (counts.completed > 0) {
			return EnumProducerStatus.Completed;
		}
		if (counts.interested > 0) {
			return EnumStatus.Tentative;
		}
		if (counts.live > 0) {
			return EnumProducerStatus.Live;
		}
		if (counts.confirmed > 0) {
			return EnumStatus.Confirmed;
		}
		if (counts.enquiry > 0) {
			return EnumStatus.Enquiry;
		}
		return null;
	};

	const counts = {
		completed: marking?.completedCount || 0,
		live: marking?.liveCount || 0,
		confirmed: marking?.confirmedCount || 0,
		interested: marking?.interestedCount || 0,
		enquiry: marking?.enquiryCount || 0,
		blackout: marking?.blackoutCount || 0,
	};

	const isBlocked = isDateBlocked;
	const status = getStatus(isBlocked, counts);

	const projectCounts = isTalentOrManager
		? [
				{ count: counts.confirmed, status: EnumStatus.Confirmed },
				{ count: counts.enquiry, status: EnumStatus.Enquiry },
				{ count: counts.interested, status: EnumStatus.Tentative },
				{ count: counts.blackout, status: EnumStatus.Blocked },
		  ]
		: [
				{ count: counts.completed, status: EnumProducerStatus.Completed },
				{ count: counts.live, status: EnumProducerStatus.Live },
		  ];

	return {
		isBlocked,
		status,
		projectCounts,
		userType,
	};
};
