import * as z from 'zod';

export const knownPersonSchema = z.object({
	mobile_number: z
		.string()
		.min(10, { message: 'Mobile number must be 10 digits' })
		.max(10, { message: 'Mobile number must be 10 digits' })
		.regex(/^[0-9]+$/, { message: 'Only numbers are allowed' }),
	link: z.string().url({ message: 'Invalid link format' }),
});

export type KnownPersonFormType = z.infer<typeof knownPersonSchema>;
