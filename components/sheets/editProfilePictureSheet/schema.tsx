import CONSTANTS from '@constants/constants';
import * as z from 'zod';

const FormSchema = z.object({
	profile_picture: z.any().refine((file: File) => {
		if (file?.size > CONSTANTS.MAX_FILE_SIZE) return false;
		else return true;
	}, `Max File size is ${CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)} Mb`),
});

export default FormSchema;
