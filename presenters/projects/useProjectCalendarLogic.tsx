import { useMemo } from 'react';
import { DateData, MarkedDates } from 'react-native-calendars/src/types';
import { useNavigation } from '@react-navigation/native';
import { UnistylesRuntime } from 'react-native-unistyles';

import { useProjectsContext } from './ProjectContext';
import useGetProducerCalendarList from '@network/useGetProducerCalendarList';
export interface IMarkedDates extends MarkedDates {
	[date: string]: {
		completedCount?: number;
		liveCount?: number;
		totalCount?: number;
		confirmedCount?: number;
		enquiryCount?: number;
		blackoutCount?: number;
	} & MarkedDates[string];
}

export const useProjectCalendarLogic = () => {
	const { markedDates, producerMarkedDates, talentMarkedDates } = useMemo(() => {
		const dates: IMarkedDates = {};
		const producerDates: IMarkedDates = {};
		const talentDates: IMarkedDates = {};

		projects?.forEach(project => {
			const date = project.date;
			if (!dates[date]) {
				dates[date] = {
					selected: true,
					completedCount: project?.completed,
					liveCount: project?.live,
					totalCount: project?.completed + project?.live,
					confirmedCount: project?.confirmed,
					enquiryCount: project?.enquiry,
					blackoutCount: project?.blackout,
				};
			}
			if (project.status === 'Completed') {
				dates[date].completedCount! += 1;
			} else if (project.status === 'Ongoing') {
				dates[date].liveCount! += 1;
			} else if (project.status === 'Confirmed') {
				dates[date].confirmedCount! += 1;
			} else if (project.status === 'Enquiry') {
				dates[date].enquiryCount! += 1;
			} else if (project.status === 'Blackout') {
				dates[date].blackoutCount! += 1;
			}
			if (project.status === 'Completed' || project.status === 'Ongoing') {
				dates[date].totalCount! += 1;
			}

			// Populate producerDates and talentDates
			if (dates[date].completedCount! > 0 || dates[date].liveCount! > 0) {
				producerDates[date] = { ...dates[date] };
			}
			if (dates[date].confirmedCount! > 0 || dates[date].enquiryCount! > 0) {
				talentDates[date] = { ...dates[date] };
			}
		});

		return { markedDates: dates, producerMarkedDates: producerDates, talentMarkedDates: talentDates };
	}, [projects]);

	return { markedDates, producerMarkedDates, talentMarkedDates, getDayOfWeek, formatDate, getMonth, handleDayPress, height };
};
