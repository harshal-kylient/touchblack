import * as z from 'zod';

const FormSchema = z.object({
	studio_floor_booking_id: z.string(),
	conversation_id: z.string(),
	reason: z.enum(['other_commitments', 'personal_reason', 'other']),
	customReason: z.string().optional(),
});

export type OptOutFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
