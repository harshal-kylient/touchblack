import { z } from 'zod';

const FormSchema = z.object({
	month: z.object({
		value: z.string(),
		name: z.string(),
	}),
	year: z.object({
		value: z.string(),
		name: z.string(),
	}),
	project: z.object({
		id: z.string(),
		name: z.string(),
	}),
});

export type FilterInvoicesFormValues = z.infer<typeof FormSchema>;

export default FormSchema;
