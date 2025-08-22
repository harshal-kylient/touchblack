import * as z from 'zod';

const FormSchema = z.object({
	conversation_id: z.string().min(1, { message: 'Conversation ID is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	payment_terms: z.string().nullable(),
	cancellation_charges: z.string().nullable(),
	comments: z.string().optional(),
	gst_applicable: z.boolean().optional(),
	status: z.string().optional(),
});

export type NegotiationFormValues = z.infer<typeof FormSchema>;

export default FormSchema;
