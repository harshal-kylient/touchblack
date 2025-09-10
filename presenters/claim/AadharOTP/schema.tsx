import * as z from 'zod';

const AadharOTPFormSchema = z.object({
	otp: z
		.string({
			required_error: 'OTP is required',
		})
		.refine(arg => arg.length === 6, 'OTP is invalid'),
});

export default AadharOTPFormSchema;
