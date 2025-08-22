export interface IMarkedDates {
	[date: string]: {
		selected: boolean;
		customStyles: {
			container: {
				backgroundColor: string;
				borderRadius: number;
				justifyContent: 'center' | 'flex-start' | 'flex-end';
				alignItems: 'center' | 'flex-start' | 'flex-end';
			};
		};
	};
}
