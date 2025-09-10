import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import * as z from 'zod';

const FormSchema = (type: FilmOptionsEnum) =>
	z.object({
		film_id: z.string(),
		film_name: z.any().refine((value: string) => {
			if (type === FilmOptionsEnum.ProducerFilms) {
				return true;
			}
			return !!value;
		}, 'Film Name is required'),
		notes: z.any().refine((value: string) => {
			if (type !== FilmOptionsEnum.ProducerFilms) {
				return true;
			}
			return !!value;
		}, 'Note is required'),
	});

export default FormSchema;
