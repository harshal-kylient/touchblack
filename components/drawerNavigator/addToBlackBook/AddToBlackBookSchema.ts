import { z } from 'zod';

const AddToBlackBookFormSchema = z.object({
	bookmark_id: z.string(),
	rating: z.string().nullable().optional(),
	notes: z.string().min(1, { message: 'Note is required' }).max(500, { message: 'Note cannot exceed 500 characters' }),
	film_ids: z.array(z.string()).optional(),
});

export default AddToBlackBookFormSchema;
