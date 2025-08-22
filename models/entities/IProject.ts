import { IStatus } from '@presenters/projects/useProjectCalendarLogic';
import { IProjectTalentSchedule } from './IProjectTalentSchedule';

interface IProject {
	id: UniqueId;
	producer_id: UniqueId;
	video_type_id: UniqueId;
	brand_id: UniqueId;
	project_name: string;
	film_brief: string; // description of the film (can be a pdf or a text)
	status: IStatus; // onging, completed and pending are for producer, confirmed, enquiry and blackout are for talent
	talentSchedule: IProjectTalentSchedule;
	unreadCount?: number;
	startDate?: string;
	location?: string[];
}

export default IProject;
