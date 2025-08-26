import IValueWithId from './IValueWithId';

export interface IMessageTemplateInvitation {
	message: string;
	brand_name: string;
	project_name: string;
	film_type: string;
	film_brief: string | null;
	location: IValueWithId[];
	dates: string[];
	status: 'Live' | 'Completed';
	film_brief_url: string | null;
}

export interface IMessageTemplateNegotiation {
	negotiation_id: UniqueId;
	conversation_id: UniqueId;
	sender_id: UniqueId;
	amount: number;
	status: 'Pending' | 'Confirmed';
	created_at: string;
}

type IMessageTemplates = IMessageTemplateInvitation | IMessageTemplateNegotiation;

export default IMessageTemplates;
