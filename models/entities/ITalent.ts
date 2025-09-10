export interface ITalent {
	id: string;
	name: string;
	profile_pic_url: string;
	profession: string;
	city: string;
	isBookmarked: boolean;
	isSelected: boolean;
	status?: 'Confirmed' | 'Opted out' | 'Closed' | 'Tentative' | 'Not available';
}
