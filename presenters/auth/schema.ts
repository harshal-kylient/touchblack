import * as z from 'zod';

const FormSchema = z.object({
	user_identifier: z
		.string({
			required_error: 'Phone number is required to signup',
		})
		.refine(arg => arg.length === 10, 'Invalid phone number'),
	otp: z.string({
		required_error: 'OTP is required',
	}),
});

export default FormSchema;
