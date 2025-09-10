import * as z from 'zod';

export const FormSchema1 = z.object({
	video_type_id: z
		.object(
			{
				id: z.string({
					required_error: 'Film type selection is required',
				}),
				name: z.string({
					required_error: 'Film type selection is required',
				}),
			},
			{ required_error: 'Film type selection is required', invalid_type_error: 'Film type selection is required' },
		)
		.refine(arg => arg.id && arg.name, 'Film type selection is required'),
	brand_id: z
		.object({
			id: z.string({
				required_error: 'Brand selection is required',
			}),
			name: z.string({
				required_error: 'Brand selection is required',
			}),
		})
		.nullable()
		.optional(),
	project_name: z
		.string({
			required_error: 'Project name is required',
			invalid_type_error: 'Project name is required',
		})
		.refine(arg => arg.length > 1, 'Project name should be at least 2 characters long'),
	location_ids: z
		.array(
			z.object({
				id: z.string({
					required_error: 'Location is required',
				}),
				name: z.string({
					required_error: 'Location is required',
				}),
			}),
			{ required_error: 'Location is required', invalid_type_error: 'Location is required' },
		)
		.refine(arg => arg.length, 'Location is required'),
	film_brief: z.string().nullable().optional(),
	film_brief_attachment: z
		.any()
		.refine((file: File) => {
			if (!file?.size) return true;
			if (file?.size > 20 * 1024 * 1024) return false;
			else return true;
		}, `Max File size is ${20} Mb`)
		.nullable()
		.optional(),
});

export const FormSchema2 = z.object(
	{
		project_invitations: z
			.array(
				z.object(
					{
						dates: z.array(z.string()),
						profession_id: z.object({
							id: z.string(),
							name: z.string(),
						}),
						project_id: z.string().nullable().optional(),
						talent_ids: z.array(
							z.object(
								{
									id: z.string().nullable().optional(),
									first_name: z.string().nullable().optional(),
									last_name: z.string().nullable().optional(),
									profile_picture_url: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									Is_bookmarked: z.boolean().nullable().optional(),
									profession: z.string().nullable().optional(),
								},
								{ invalid_type_error: 'Talents need to be object' },
							),
						),
					},
					{ invalid_type_error: 'Project Invitation needs to be object' },
				),
			)
			.refine(arg => arg.length, 'Profession selection is required')
			.refine(arg => {
				for (let i = 0; i < arg.length; i++) {
					if (!arg[i].dates.length) return false;
					else return true;
				}
			}, 'Date Selection is required')
			.refine(arg => {
				for (let i = 0; i < arg.length; i++) {
					if (!arg[i].talent_ids.length) return false;
					else return true;
				}
			}, 'Talent Selection is required'),
	},
	{ invalid_type_error: 'Schema needs to be an object' },
);

export const FormSchema3 = z
	.object({
		dates: z.any(),
		full_day: z.boolean().nullable().optional(),
		from_time: z.string().nullable().optional(),
		to_time: z.string().nullable().optional(),
	})
	.refine(arg => Array.from(Object.keys(arg.dates)).length, { message: 'Date Selection is required', path: ['dates'] })
	.refine(arg => (arg.full_day ? true : arg.from_time), { message: 'From Time is required', path: ['from_time'] })
	.refine(arg => (arg.full_day ? true : arg.to_time), { message: 'To Time is required', path: ['to_time'] });
