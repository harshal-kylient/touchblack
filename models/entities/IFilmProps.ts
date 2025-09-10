export interface IFilmProps {
	brand_id: string | null;
	city: string | null;
	country_id: string | null;
	created_at: string;
	director_id: string | null;
	duration: string;
	film_link: string;
	film_name: string;
	film_type: string;
	film_id: string;
	id: UniqueId;
	owner_name: string;
	thumbnail_url: string;
	industry_id: string | null;
	is_pinned: boolean;
	is_private: boolean;
	is_verified: boolean;
	language_id: string | null;
	make_trending: boolean;
	notes: string | null;
	owner_id: string;
	owner_type: string;
	status: string;
	updated_at: string;
	video_type_id: string | null;
	year_of_release: string | null;
	production_house: string;
}
