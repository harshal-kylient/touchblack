import * as z from 'zod';

const FormSchema = z.object({
	conversation_id: z.string().min(1, { message: 'Conversation ID is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	payment_terms: z.string().nullable().optional(),
	cancellation_charges: z.string().nullable().optional(),
	comments: z.string().optional(),
	gst_applicable: z.boolean().optional(),
	gst: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional()
		.nullable(),
});

export type RaiseClaimFormValues = z.infer<typeof FormSchema>;

export default FormSchema;
