import * as z from 'zod';

const FormSchema = z.object({
	user_identifier: z
		.string({
			required_error: 'Phone number is required to signup',
		})
		.refine(arg => arg.length === 10, 'Invalid phone number'),
	unique_device_id: z.string({}).nullable().optional(),
	tnc_accepted: z
		.boolean({
			required_error: 'Please Accept Terms and Conditions',
		})
		.refine(arg => arg, 'Please Accept Terms and Conditions'),
});

export default FormSchema;
