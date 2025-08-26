interface IAvailableTalent {
	id: UniqueId;
	first_name: string;
	last_name: string;
	profession: string;
	profession_type: string;
	location: string;
	city: string;
	is_bookmarked: boolean;
	profile_picture_url: string;
}

export default IAvailableTalent;
