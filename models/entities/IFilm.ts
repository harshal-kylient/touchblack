interface IFilm {
	owner_name: string;
	owner_id: string;
	owner_profile_picture_url: string | null;
	film_id: string;
	id: string;
	film_name: string;
	film_link: string;
	owner_type: string;
	film_type: string;
	is_pinned: boolean;
	is_private: boolean;
	is_verified: boolean;
	is_restricted: boolean;
	thumbnail_url: string | null;
	production_house: string | null;
	city: string | null;
	country: string | null;
	make_trending: boolean;
	brand: {
		id: string;
		name: string;
		black_enum_type: string;
		description: string | null;
		extra_data: any | null;
		created_at: string;
		updated_at: string;
	};
	duration: string;
	director: string;
	year_of_release: number;
	industry: {
		id: string;
		name: string;
		black_enum_type: string;
		description: string | null;
		extra_data: any | null;
		created_at: string;
		updated_at: string;
	};
	genre: {
		id: string;
		name: string;
		black_enum_type: string;
		description: string | null;
		extra_data: any | null;
		created_at: string;
		updated_at: string;
	}[];
}

export default IFilm;
