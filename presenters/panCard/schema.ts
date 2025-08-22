import CONSTANTS from '@constants/constants';
import * as z from 'zod';

const FormSchema = z.object({
	proof_type: z.string().min(1, { message: 'Proof type is required' }),
	proof_number: z.string().min(1, { message: 'PAN is required' }).regex(CONSTANTS.PAN_REGEX, { message: 'Invalid PAN format' }),
	name: z.string().optional(),
});

export type PanCardFormValues = z.infer<typeof FormSchema>;
export default FormSchema;
