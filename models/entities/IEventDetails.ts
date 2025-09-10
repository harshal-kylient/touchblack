export interface IEventDetails {
	id: string;
	title: string;
	about: string;
	poster_url: string | null;
	event_type: string;
	event_date: string;
	start_time: string;
	end_time: string;
	venue_name: string;
	city: string;
	layout: string;
	address_details:string;
	entry_type: string;
	registration_deadline: string;
	access_level: string;
	languages: string[];
	facilities: string[];
	roles: string[];
	max_capacity: number;
	show_remaining_slots: boolean;
	remaining_slots: number;
	instructions: string;
	tnc_document_url: string | null;
}
