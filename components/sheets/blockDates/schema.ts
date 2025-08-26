import * as z from 'zod';
import moment from 'moment';
import EnumStatus from '@models/enums/EnumStatus';

const dateRegex = /\d{2}\/\d{2}\/\d{4}/;

export enum Reason {
	Project = 'project',
	Personal = 'personal',
}

const FormSchema = z
	.object({
		reason: z.nativeEnum(Reason),
		project_name: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		project_status: z
			.object({
				id: z.nativeEnum(EnumStatus).nullable().optional(),
				name: z.nativeEnum(EnumStatus).nullable().optional(),
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
		full_day: z.boolean().nullable().optional(),
		from_time: z.string().nullable().optional(),
		to_time: z.string().nullable().optional(),
		notes: z.any(),
	})
	.refine(
		data => {
			if (data.reason === Reason.Project && !data.project_name) {
				return false;
			}
			return true;
		},
		{
			message: 'Project name is required',
			path: ['project_name'],
		},
	)
	.refine(
		data => {
			if (data.reason === Reason.Project && !data.project_status) {
				return false;
			}
			return true;
		},
		{
			message: 'Project status is required',
			path: ['project_status'],
		},
	)
	.refine(arg => (arg.full_day ? true : arg.from_time), { message: 'From Time is required', path: ['from_time'] })
	.refine(arg => (arg.full_day ? true : arg.to_time), { message: 'To Time is required', path: ['to_time'] });

export default FormSchema;
