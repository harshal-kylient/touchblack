import CONSTANTS from '@constants/constants';
import * as z from 'zod';

function checkFileType(file: File) {
	if (file?.name) {
		const fileType = file.name.split('.').pop();
		if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'webp') {
			return true;
		}
		return false;
	}
}

const imageSchema = z
	.any()
	.refine((file: File) => !file || checkFileType(file), 'Only .png, .jpeg, .jpg, .webp formats are supported')
	.refine((file: File) => !file || file?.size < CONSTANTS.MAX_FILE_SIZE, `Max file size is ${CONSTANTS.MAX_FILE_SIZE / 1024 ** 2}MB`);

const FormSchema = z.object({
	profile_picture: z.any().refine((file: File) => {
		if (file?.size > CONSTANTS.MAX_FILE_SIZE) return false;
		else return true;
	}, `Max File size is ${CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)} Mb`),
	profession_id: z.object(
		{
			id: z.string({
				required_error: 'Profession type is required',
			}),
			name: z.string({
				required_error: 'Profession type is required',
			}),
		},
		{ required_error: 'Profession type is required', invalid_type_error: 'Profession type is required' },
	),
	first_name: z
		.string({
			required_error: 'First Name is required',
		})
		.max(15, { message: 'First Name should contain less than 15 charecters' })
		.nonempty('First Name is required')
		.regex(/^[^\s]+(?: [^\s]+)?$/, { message: 'First Name can have only one space in the middle' }),
	last_name: z
		.string({
			required_error: 'Last Name is required',
		})
		.max(10, { message: 'Last Name should contain less than 10 charecters' })
		.nonempty('Last Name is required')
		.regex(/^\S+$/, { message: 'Last Name should not contain spaces' }),
});

export default FormSchema;
