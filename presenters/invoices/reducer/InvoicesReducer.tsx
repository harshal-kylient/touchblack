export type Action = { type: 'SELECT_PROJECT'; payload: number | null } | { type: 'SELECT_INVOICE'; payload: number } | { type: 'DESELECT_INVOICE'; payload: number } | { type: 'RESET' };

export interface State {
	selectedProject: number | null;
	selectedInvoices: number[];
}

export const invoicesReducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SELECT_PROJECT':
			return {
				...state,
				selectedProject: action.payload,
				selectedInvoices: action.payload === state.selectedProject ? state.selectedInvoices : [],
			};
		case 'SELECT_INVOICE':
			return {
				...state,
				selectedInvoices: [...state.selectedInvoices, action.payload],
			};
		case 'DESELECT_INVOICE':
			return {
				...state,
				selectedInvoices: state.selectedInvoices.filter(id => id !== action.payload),
			};
		case 'RESET':
			return {
				selectedProject: null,
				selectedInvoices: [],
			};
		default:
			return state;
	}
};
