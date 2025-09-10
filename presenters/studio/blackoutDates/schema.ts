import moment from 'moment';
import * as z from 'zod';

export enum ReasonType {
	Project = 'project',
	Event = 'event',
}

export enum StudioProjectStatus {
	'Enquiry' = 'Enquiry',
	'Tentative' = 'Tentative',
	'Confirmed' = 'Confirmed',
}

const FormSchema = z
	.object({
		reason_type: z.nativeEnum(ReasonType),
		title: z.string().min(1, { message: 'Title is required' }),
		blocked_project_status: z
			.object({
				id: z.nativeEnum(StudioProjectStatus).nullable().optional(),
				name: z.nativeEnum(StudioProjectStatus).nullable().optional(),
			})
			.nullable()
			.optional(),
		from_date: z
			.string({
				required_error: 'From Date is required',
				invalid_type_error: 'From Date is required',
			})
			.refine(
				value => {
					const date = moment(value, 'YYYY-MM-DD');
					return date.isValid() && date.year() >= moment().year() && date.month() >= moment().month() && date.month() === moment().month() ? date.date() >= moment().date() : true;
				},
				{ message: 'From Date must be a valid future date' },
			),
		to_date: z
			.string({
				required_error: 'To Date is required',
				invalid_type_error: 'To Date is required',
			})
			.refine(
				value => {
					const date = moment(value, 'YYYY-MM-DD');
					return date.isValid() && date.year() >= moment().year() && date.month() >= moment().month() && date.month() === moment().month() ? date.date() >= moment().date() : true;
				},
				{ message: 'To Date must be a valid future date' },
			),
		notes: z.string().nullable().optional(),
	})
	.refine(data => {
		if (data.reason_type === ReasonType.Event && !data.blocked_project_status) {
			return true;
		}
		return true;
	})
	.refine(
		data => {
			if (data.reason_type === ReasonType.Project && !data.blocked_project_status) {
				return false;
			}
			return true;
		},
		{
			message: 'Project status is required',
			path: ['blocked_project_status'],
		},
	);

export default FormSchema;
