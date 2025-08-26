import EnumStatus from '@models/enums/EnumStatus';

export default function transformTalentCalendarResponse(response: any) {
	const result: any = {};

	for (const date in response) {
		const counts = {
			completedCount: 0,
			liveCount: 0,
			totalCount: 0,
			confirmedCount: 0,
			interestedCount: 0,
			enquiryCount: 0,
			blackoutCount: 0,
		};

		response[date]?.forEach(project => {
			counts.totalCount++;

			if (project.status === EnumStatus.Enquiry) {
				counts.enquiryCount++;
			}

			if (project.status === EnumStatus.Tentative) {
				counts.interestedCount++;
			}

			if (project.status === EnumStatus.Confirmed) {
				counts.confirmedCount++;
			}

			if (project.status === EnumStatus.Blocked) {
				counts.blackoutCount++;
			}
		});
		result[date] = counts;
	}

	return result;
}
