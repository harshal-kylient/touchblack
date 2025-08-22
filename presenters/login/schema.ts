import * as z from 'zod';

const FormSchema = z.object({
	user_identifier: z
		.string({
			required_error: 'uh oh! we are missing a digit or three',
		})
		.refine(arg => arg.length === 10, 'uh oh! we are missing a digit or three'),
	unique_device_id: z.string({}).nullable().optional(),
	tnc_accepted: z
		.boolean({
			required_error: 'Please Accept Terms and Conditions',
		})
		.refine(arg => arg, 'Please Accept Terms and Conditions'),
});

export default FormSchema;
