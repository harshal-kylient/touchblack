import * as z from 'zod';

const FormSchema1 = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email is required',
		})
		.email(),
});

const FormSchema2 = z.object({
	otp: z
		.string({
			required_error: 'OTP is required',
			invalid_type_error: 'OTP is required',
		})
		.min(6, 'OTP should be minimum of 6 digits')
		.max(6, 'OTP should be maximum of 6 digits'),
});

export enum ReasonEnumMessage {
	'Film link broken' = 'broken_film_link',
	'Missing credit/incorrect name credit/incorrect role credit' = 'missing_credit',
	'Wrong film (thumbnail issue, link issues, etc.)' = 'wrong_film_link',
	'Inappropriate reasons' = 'inappropriate_reasons',
	'Wrong production house credit' = 'wrong_production_house',
	'Other' = 'other',
}

export enum ReasonEnumInternal {
	broken_film_link = 'broken_film_link',
	missing_credit = 'missing_credit',
	wrong_film_link = 'wrong_film_link',
	inappropriate_reasons = 'inappropriate_reasons',
	wrong_production_house = 'wrong_production_house',
	other = 'other',
}

const FormSchema3 = z
	.object({
		report_type: z.object({
			id: z.nativeEnum(ReasonEnumMessage, {
				required_error: 'Reason type selection is mandatory',
			}),
			name: z.string(),
		}),
		url: z.string().nullable().optional(), // url sent in the report
		talent_name: z.string().nullable().optional(),
		role: z
			.object({
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
			})
			.nullable()
			.optional(),
		note: z.string().nullable().optional(),
	})
	.refine(
		data => {
			if (data.report_type.id === ReasonEnumInternal.inappropriate_reasons && !data.note) return false;
			else return true;
		},
		{
			message: 'Note is required',
			path: ['note'],
		},
	);

export { FormSchema1, FormSchema2, FormSchema3 };
