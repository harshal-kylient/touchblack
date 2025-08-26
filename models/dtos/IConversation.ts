import IMessageContent from '@models/entities/IMessageContent';
import EnumMessageType from '@models/enums/EnumMessageType';

interface IConversation {
	id: UniqueId;
	party2_type: 'Producer' | 'User';
	party1_id: UniqueId;
	party2_id: UniqueId;
	conversation_type: 'project' | 'other';
	created_at: string;
	updated_at: string;
	project_id: UniqueId;
	reciever_name: string;
	reciever_profile_picture: string;
	last_message: {
		id: UniqueId;
		conversation_id: UniqueId;
		sender_id: UniqueId;
		content: IMessageContent;
		created_at: string;
		updated_at: string;
		message_type: EnumMessageType | null;
	};
	is_last_message_read: boolean;
}

export default IConversation;
