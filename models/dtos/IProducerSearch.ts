interface IProducerSearch {
	id: string;
	name: string;
	producer_type: string;
	isBookmarked: boolean;
	location_name: string;
	isVerified: boolean;
	profile_picture_url: URL | string;
	gst_number: string;
	pan_number: string;
	description: string;
	business_type: string;
	email: string;
	awards: string[];
	producerId: string;
}

export default IProducerSearch;
