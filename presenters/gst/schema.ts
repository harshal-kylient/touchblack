import * as z from 'zod';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[A-Z0-9]{1}$/;

const FormSchema = z.object({
	gstin: z.string().min(1, { message: 'GSTIN is required' }).regex(GSTIN_REGEX, { message: 'Invalid GSTIN format' }),
	address: z.string().min(1, { message: 'Address is required' }),
	state_id: z.object({
		id: z.string().min(1, { message: 'State is required' }),
		name: z.string(),
	}),
	pincode_id: z.object({
		id: z.string().min(1, { message: 'Pincode is required' }),
		name: z.string(),
	}),
	legal_name: z.string().min(1, { message: 'Legal Name is required' }),
	user_id: z.string().min(1, { message: 'User ID is required' }),
	gst_pincode: z.string().optional(),
});

export type GSTFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
