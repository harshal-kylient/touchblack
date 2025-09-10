import { z } from 'zod';

const FormSchema1 = z.object({
	bio: z
		.string({
			required_error: 'Too short bio',
		})
		.refine(arg => arg?.length > 1, 'Too short bio'),
});

const FormSchema2 = z.object({
	awards: z.array(
		z.object({
			owner_award_id: z.string().nullable().optional(),
			award_id: z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.refine(arg => arg?.id && arg?.name, 'Award selection is required'),
			film_id: z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.refine(arg => arg?.id && arg?.name, 'Film selection is required'),
			year_of_award: z.string({
				required_error: 'Year of award is required',
			}),
		}),
	),
});

export { FormSchema1, FormSchema2 };
