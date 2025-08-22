import * as z from 'zod';

const FormSchema1 = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email is required',
		})
		.email(),
});

const FormSchema2 = z.object({
	otp: z
		.string({
			required_error: 'OTP is required',
			invalid_type_error: 'OTP is required',
		})
		.min(6, 'OTP should be minimum of 6 digits')
		.max(6, 'OTP should be maximum of 6 digits'),
});
export { FormSchema1, FormSchema2 };
