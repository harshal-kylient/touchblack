interface ITalentSearch {
	awards: Array<any>;
	bio: string | null;
	city: string | null;
	country: string | null;
	dob: string | null;
	first_name: string;
	gender: string | null;
	institutes: Array<any>;
	last_name: string;
	mobile_number: string;
	profile_pic_url: string;
	profile_picture_url: string;
	rate: string | null;
	state: string | null;
	user_id: string;
	films: string[];
	profession: string;
	profession_type: string;
	works_with: string[];
	user_producer_mappings: string[];
	is_bookmarked: boolean;
	talent_role: string;
}

export default ITalentSearch;
