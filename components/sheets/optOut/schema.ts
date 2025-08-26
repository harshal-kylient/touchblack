import * as z from 'zod';

const FormSchema = z.object({
	reason: z.enum(['appreciate', 'honored', 'grateful', 'other']),
	customReason: z.string().optional(),
});

export type OptOutFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
