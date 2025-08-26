import * as z from 'zod';

const FormSchema = z.object({
	studio_floor_booking_id: z.string().min(1, { message: 'Booking ID is required' }),
	conversation_id: z.string().min(1, { message: 'Conversation ID is required' }),
	full_advance: z.boolean().optional(),
	advance_amount: z.string().nullable().optional(),
	payment_terms: z.string().nullable(),
	cancellation_charges: z.string().nullable(),
	comments: z.string().optional(),
	gst_applicable: z.boolean().optional(),
});

export type NegotiationFormValues = z.infer<typeof FormSchema>;

export default FormSchema;
