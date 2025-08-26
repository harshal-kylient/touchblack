import * as z from 'zod';
import { ytRegex, vimeoRegex } from '../../../utils/regex';

export enum Reason {
	Showreel = 'showreel',
	Otherwork = 'other_work',
}

const FormSchema = (type: 'talent' | 'producer') =>
	z
		.object({
			owner_id: z
				.object({
					id: z.string().nullable().optional(),
					name: z.string().nullable().optional(),
				})
				.nullable()
				.optional(),

			// Reason is optional for producer, required for talent
			work_type:
				type === 'producer'
					? z.nativeEnum(Reason).optional()
					: z.nativeEnum(Reason, {
							required_error: 'Reason is required',
					  }),

			film_name: z
				.string({
					required_error: 'Film name is required',
				})
				.min(1, 'Film name is required'),

			film_link: z
				.string({
					required_error: 'Film link is required',
				})
				.refine(value => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), {
					message: 'Please enter a valid url',
				})
				.refine(value => vimeoRegex.test(value) || ytRegex.test(value), {
					message: 'Please enter a valid URL from YouTube or Vimeo',
				}),

			// Crew link is always optional at base level, validation happens in superRefine
			crew_link: z.string().optional().nullable(),

			notes: z.string().optional().nullable(),
		})
		.superRefine((data, ctx) => {
			console.log('Super refine triggered, type:', type, 'reason:', data.reason);

			// For producer users
			if (type === 'producer') {
				// Crew link is always required for producers
				if (!data.crew_link || data.crew_link.trim() === '') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Crew link is required',
						path: ['crew_link'],
					});
				}
				// Valid URL format check for producers
				else if (!/^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(data.crew_link)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Please enter a valid crew URL',
						path: ['crew_link'],
					});
				}
			}
		});

export default FormSchema;
