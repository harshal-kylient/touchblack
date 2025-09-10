import { z } from 'zod';

// Base64 encoded image size calculation function
const base64Length = (base64String: string) => {
	const padding = (base64String.match(/[=]/g) || []).length;
	const inBytes = base64String.length * (3 / 4) - padding;
	return inBytes;
};

const handleAadharImageSize = (arr: string[]) => {
	return arr.every(item => item.endsWith('.jpeg') && base64Length(item) <= 250000);
};

const FormSchema = z.object({
	aadhar_number: z
		.string({
			required_error: 'Please enter a valid aadhar number',
		})
		.min(12)
		.max(12)
		.refine(arg => arg.length === 12, { message: 'Please enter a valid aadhar number' }),
	aadhar_images: z.array(z.string()).min(2).max(2).refine(handleAadharImageSize, { message: 'All images must be .jpeg format and less than 250kb' }).optional(),
});

export { FormSchema };
