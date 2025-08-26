import IMessageTemplates from './IMessageTemplates';

interface IMessageItem {
	message_id: UniqueId;
	sender_id: UniqueId;
	sender_type: 'producer' | 'talent' | 'studio';
	content: IMessageTemplates;
	created_at: string;
	// notification is for invoice
	message_type: 'template' | 'negotiation' | 'claim' | 'notification' | 'project_completion' | 'opted_out' | 'payment';
	message_reads: string[];
	sentByMe: string;
}

export default IMessageItem;
