import { string, z } from 'zod';

const FormSchema1 = z.object({
	first_name: z
		.string({
			required_error: 'First Name is required',
		})
		.max(15, { message: 'First Name should contain less than 15 charecters' })
		.nonempty('First Name is required')
		.regex(/^\S+$/, { message: 'First Name should not contain spaces' }),
	last_name: z
		.string({
			required_error: 'Last Name is required',
		})
		.max(10, { message: 'Last Name should contain less than 10 charecters' })
		.nonempty('Last Name is required')
		.regex(/^\S+$/, { message: 'Last Name should not contain spaces' }),
	dob: z
		.string()
		.refine(arg => arg.length === 10 && arg[4] === '-' && arg[7] === '-', 'Please input dob in 1990-01-23 format')
		.nullable()
		.optional(),
	gender: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.refine(arg => arg?.id && arg?.name, 'Gender is required'),
	bio: z.string().nullable().optional(),
	rate: z.string(),
	language_ids: z
		.array(
			z.object({
				id: z.string().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
	pincode_id: z
		.object(
			{
				id: z.string({
					required_error: 'Pincode is required',
				}),
				name: z.string({
					required_error: 'Pincode is required',
				}),
			},
			{ required_error: 'Pincode is required', invalid_type_error: 'Pincode is required' },
		)
		.nullable()
		.optional(),
	district_id: z
		.object({
			id: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			state_id: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	profession_id: z.object(
		{
			id: z.string(),
			name: z.string(),
		},
		{ required_error: 'Profession type is required', invalid_type_error: 'Profession type is required' },
	),
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
				.refine(arg => arg?.name, 'Award selection is required'),
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

const FormSchema3 = z.object({
	university: z.array(
		z.object({
			user_institute_mapping_id: z.string().nullable().optional(),
			id: z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.refine(arg => arg?.name.length > 0, 'Institute selection is required'),
			year_of_graduation: z
				.string({
					required_error: 'Year of completion is required',
				})
				.nonempty('Year of completion is required'),
		}),
	),
});

export { FormSchema1, FormSchema2, FormSchema3 };
