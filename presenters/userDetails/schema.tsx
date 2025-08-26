import * as z from 'zod';

const FormSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email is required',
		})
		.email(),
	state_id: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.refine(data => data.id && data.name, { message: 'State is required' }),
	gstin: z
		.object({
			id: z.string().nonempty('Please select your GSTIN'),
			stateId: z.string(),
			name: z.string(),
		})
		.nullable()
		.optional(),
	gst_state_id: z.string().optional(),
});

export default FormSchema;
