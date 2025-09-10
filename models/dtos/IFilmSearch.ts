interface IFilmSearch {
	id: string;
	film_name: string;
	film_link: URL;
	brand_id: null;
	owner_type: string;
	owner_id: string;
	production_house: string;
	industry_id: string;
	industry_type: string;
	genre_id: string;
	director: string;
	year_of_release: number;
	duration: string;
	language_id: string;
	language_type: string;
	video_type_id: string;
}

export default IFilmSearch;
