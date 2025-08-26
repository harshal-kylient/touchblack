interface IAward {
	id: string;
	film_id: string;
	film_name: string;
	awards_name: string;
	year_of_award: number | null;
}

export default IAward;
