import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import useGetTalentCalendarList from '@network/useGetTalentCalendarList';
import transformTalentCalendarResponse from '@utils/transformTalentCalendarResponse';
import { DateData } from 'react-native-calendars';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';

export const useCalendarDayLogic = (date: DateData, marking: any) => {
	const { loginType, userId } = useAuth();
	const { data: talent_projects } = useGetTalentCalendarList(userId!, `${date.year}-${String(date.month).padStart(2, '0')}`);
	const data = transformTalentCalendarResponse(talent_projects);

	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);

	const isDateBlocked = data[date.dateString]?.blackoutCount > 0;

	const getStatus = (isBlocked: boolean, counts: { [key: string]: number }) => {
		if (isBlocked && loginType === 'talent') {
			return EnumStudioStatus['Not available'];
		}
		if (counts.completed > 0 && counts.live > 0) {
			return 'Both';
		}
		if (counts.completed > 0) {
			return EnumStudioStatus.Completed;
		}
		if (counts.tentative > 0) {
			return EnumStudioStatus.Tentative;
		}
		if (counts.confirmed > 0) {
			return EnumStudioStatus.Confirmed;
		}
		if (counts.enquiry > 0) {
			return EnumStudioStatus.Enquiry;
		}
		return null;
	};

	const counts = {
		completed: marking?.completedCount || 0,
		confirmed: marking?.confirmedCount || 0,
		tentative: marking?.tentativeCount || 0,
		enquiry: marking?.enquiryCount || 0,
		blackout: marking?.blackoutCount || 0,
	};

	const isBlocked = isDateBlocked;
	const status = getStatus(isBlocked, counts);

	const projectCounts = [
		{ count: counts.confirmed, status: EnumStudioStatus.Confirmed },
		{ count: counts.enquiry, status: EnumStudioStatus.Enquiry },
		{ count: counts.tentative, status: EnumStudioStatus.Tentative },
		{ count: counts.blackout, status: EnumStudioStatus['Not available'] },
	];

	return {
		isBlocked,
		status,
		projectCounts,
		userType,
	};
};
