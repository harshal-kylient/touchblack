import * as z from 'zod';

const FormSchema = z.object({
	pop: z.object({
		media: z.any().refine((file: File) => {
			return !!file;
		}, 'Proof of payment is required'),
		id: z.string().min(1, { message: 'Transaction ID is required' }),
		date: z.string().min(1, { message: 'Transaction date is required' }),
		note: z.string().optional(),
	}),
});

export type UploadPopFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
