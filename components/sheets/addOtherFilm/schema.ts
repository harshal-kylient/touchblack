import * as z from 'zod';
import { ytRegex, vimeoRegex } from '../../../utils/regex';

const FormSchema = z.object({
	film_name: z
		.string({
			required_error: 'Film name is required',
		})
		.refine(value => value.length >= 1, 'Film name is required'),
	film_link: z
		.string({
			required_error: 'Film link is required',
		})
		.refine(value => /^(https?):\/\/(?=.*\.[a-z]{2,})[^\s$.?#].[^\s]*$/i.test(value), { message: 'Please enter a valid url' })
		.refine(
			value => {
				return vimeoRegex.test(value) || ytRegex.test(value);
			},
			{
				message: 'Please enter a valid URL from YouTube or Vimeo',
			},
		),
});

export default FormSchema;
