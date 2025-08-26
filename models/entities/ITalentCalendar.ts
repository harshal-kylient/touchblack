import IProject from './IProject';

export interface IBlockedDate {
	start_date: string | Date;
	end_date: string | Date;
	notes?: string;
}

export default interface ITalentCalendar {
	talent_id: string;
	confirmed_projects: IProject[];
	enquiry_projects: IProject[];
	opted_out_projects: IProject[];
	blocked_dates: IBlockedDate[];
}
