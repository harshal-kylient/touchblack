import IValueWithId from './IValueWithId';

export default interface IMessage {
	id: UniqueId;
	party2_type: string;
	party1_id: UniqueId;
	party2_id: UniqueId;
	conversation_type: 'project' | 'Public' | 'Private';
	created_at: string;
	updated_at: string;
	project_id: UniqueId;
	reciever_name: string;
	reciever_profile_picture: string;
	last_message: {
		message: string;
		brand_name: string;
		project_name: string;
		film_type: string;
		film_brief: string | null;
		location: IValueWithId[];
		dates: string[];
		status: 'Live' | 'Completed';
		film_brief_url: string | null;
	};
	is_last_message_read: boolean;
}
