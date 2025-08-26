import * as z from 'zod';

const FormSchema = z.object({
	conversation_id: z.string().min(1, { message: 'Conversation ID is required' }),
	advance_amount: z.string().nullable().optional(),
	amount: z.string(),
	payment_terms: z.string().nullable().optional(),
	cancellation_charges: z.string().nullable().optional(),
	comments: z.string().optional(),
	gst_applicable: z.boolean().optional(),
	status: z.string().optional(),
});

export type NegotiationFormValues = z.infer<typeof FormSchema>;

export default FormSchema;
