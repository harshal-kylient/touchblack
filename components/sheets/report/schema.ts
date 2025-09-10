import * as z from 'zod';

export enum ReportedType {
	User = 'User',
	Film = 'Film',
}

export enum ReporterType {
	User = 'User',
	Producer = 'Producer',
}

const FormSchema = z.object({
	reported_entity_id: z.string({
		required_error: 'Reported Id is required',
	}),
	reported_entity_type: z.nativeEnum(ReportedType, {
		required_error: 'Reported type is required',
	}),
	reporter_type: z.nativeEnum(ReporterType, {
		required_error: 'Reporter type is required',
	}),
	reporter_id: z.string({
		required_error: 'Reporter Id is required',
	}),
	reason: z
		.string({
			required_error: 'Reason is required',
		})
		.refine(arg => arg, 'Reason is required'),
});

export default FormSchema;
