import { IFilmProps } from '@presenters/blackBook/FilmThumbnailItemForBlackBook';

export interface IBlackBookProfile {
	bookmark_id: UniqueId;
	bookmark_name: string;
	connection_level: '3rd' | '2nd' | '1st';
	films: IFilmProps[];
	id: UniqueId;
	location: string | null;
	notes: string;
	owner_id: UniqueId;
	profession_type: string | null;
	profile_picture_url: string | null;
	rating: 'High' | 'Medium' | 'Low';
	bookmark_profession_name: string;
	bookmark_profession_id: UniqueId;
}
