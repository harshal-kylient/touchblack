import * as z from 'zod';

const FormSchema = z.object({
	account_number: z.string().min(1, { message: 'Account number is required' }),
	account_holder_name: z.string().min(1, { message: 'Account holder name is required' }),
	account_type: z.object({
		id: z.number().int().min(0),
		name: z.string(),
	}),
	admin_bank_ifsc_id: z.object({
		id: z.string(),
		name: z.string(),
	}),
	black_enum_id: z.string(),
});

export type BankDetailsFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
