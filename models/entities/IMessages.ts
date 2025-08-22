// Conversation Interface
export interface IConversation {
	id: string;
	party2_type: string;
	party1_id: string;
	party2_id: string;
	conversation_type: string;
	created_at: string;
	updated_at: string;
	project_id: string;
	reciever_name: string;
	reciever_profile_picture: string;
	last_message: string | null;
	is_last_message_read: boolean;
}

// Message Interface
export interface IMessage {
	message_id: string;
}

// Negotiation Interface
export interface INegotiation {
	id: string;
	conversation_id: string;
	sender_id: string;
	amount: string;
	status: 'pending' | 'confirmed' | 'rejected';
	comments: string | null;
	cancellation_charges: string | null;
	payment_terms: string | null;
	created_at: string;
	updated_at: string;
	gst_applicable?: boolean;
}

// Producer Talent Template Interface
export interface IProducerTalentTemplate {
	message: string;
	brand_name: string;
	project_name: string;
	film_type: string;
	film_brief: string;
	location: string[];
	dates: string[];
	status: string;
}

// API Response Interfaces
export interface IApiResponse<T> {
	message: string | null;
	success: boolean;
	data: T;
}

export interface IConversationResponse extends IApiResponse<IConversation> {}
export interface IMessageResponse extends IApiResponse<{ message_id: string }> {}
export interface INegotiationResponse extends IApiResponse<{ data: INegotiation }> {}
export interface INegotiationListResponse extends IApiResponse<{ data: INegotiation[] }> {}
export interface IProducerTalentTemplateResponse extends IApiResponse<IProducerTalentTemplate> {}
