type IMessageContent =
	| {
			message: string;
			confirmed: boolean;
			amount: number;
	  }
	| {
			message: string;
			brand_name: string;
			project_name: string;
			film_type: string;
			film_brief: string;
			location: string;
			dates: string[];
	  }
	| string;

export default IMessageContent;
