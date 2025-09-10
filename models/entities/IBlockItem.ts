interface IBlockItem {
	id: UniqueId;
	name?: string;
	first_name?: string;
	last_name?: string;
	profile_picture_url?: string;
	profession_id: UniqueId;
	profession_type: string;
	dob: string | null;
	gender: null | 'Male' | 'Female';
	created_at: string;
	updated_at: string;
	extra_data: null | any;
	mobile_number: string;
	status: 'Active' | 'Inactive';
	make_trending: boolean;
}
export default IBlockItem;
