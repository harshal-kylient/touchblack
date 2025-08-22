import IAwards from './IAwards';
import IUniversity from './IUniversity';

interface ITalentAbout {
	user_id: string;
	first_name: string;
	last_name: string;
	mobile_number: string;
	dob: Date | string;
	gender: 'Male' | 'Female';
	talent_role: string;
	profession_id: string;
	profile_picture_url: string;
	pincode: string;
	city: string;
	state: string;
	country: string;
	bio: string;
	rate: number | null;
	institutes: IUniversity[];
	awards: IAwards[];
	onUpdate: (data?: unknown) => void;
	mutateAboutDetail?: () => void;
	is_bookmarked: boolean;
}

export default ITalentAbout;
