import { z } from 'zod';

const FilterFormSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	dob: z.string().transform(str => new Date(str)),
	gender: z.string().optional(),
	bio: z.string().nullable(), // Allow string or null
	rate: z.string().transform(str => Number(str)),
	pincode_id: z.string().optional(),
	district_id: z.string().optional(),
	state_id: z.string().optional(),
	country_id: z.string().optional(),
	profession_id: z.string().optional(), // Allow string or null
	Education: z.array(z.string()).optional(),
	Awards: z
		.array(
			z.object({
				year: z.string(),
				filmName: z.string(),
			}),
		)
		.optional(),
});

export { FilterFormSchema };
