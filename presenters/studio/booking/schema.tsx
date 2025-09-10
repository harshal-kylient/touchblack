import * as z from 'zod';

const FormSchema1 = z
	.object({
		city: z
			.object({
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
			})
			.nullable()
			.optional(),
		dates: z.array(z.string()),
		set_up: z.string().nullable().optional(),
		shoot: z.string().nullable().optional(),
		dismantle: z.string().nullable().optional(),
		error: z.any().optional(), // only to show custom refined error message
	})
	.refine(
		data => {
			if (data.dates?.length) return true;
			else return false;
		},
		{ message: 'Date selection is Required', path: ['error'] },
	)
	.refine(
		data => {
			const total_days = Number(data.set_up || 0) + Number(data.shoot || 0) + Number(data.dismantle || 0);
			const selected_dates = data.dates.length;
			if (total_days === selected_dates) return true;
			else return false;
		},
		{ message: 'Selected dates do not match the total project days. Please adjust.', path: ['error'] },
	);
export { FormSchema1 };
