interface IInvoice {
	id: UniqueId;
	project_name: string;
	producer_name: string;
	amount: string;
	invoice_type: 'talent_invoice' | 'touchblack_invoice';
	invoice_number: string;
	due_date: string;
	status: string;
	comments: string;
}

export default IInvoice;
