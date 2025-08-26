import { createContext, Dispatch, ReactNode, useContext, useReducer, useState } from 'react';
import { Action, invoicesReducer, State } from '../reducer/InvoicesReducer';

interface InvoicesContextType {
	state: State;
	dispatch: Dispatch<Action>;
	filteredProjectId: string | null;
	setFilteredProjectId: Dispatch<string | null>;
	filteredMonth: number | null;
	setFilteredMonth: Dispatch<number | null>;
	filteredYear: number | null;
	setFilteredYear: Dispatch<number | null>;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
	const [filteredProjectId, setFilteredProjectId] = useState<string | null>(null);
	const [filteredMonth, setFilteredMonth] = useState<number | null>(null);
	const [filteredYear, setFilteredYear] = useState<number | null>(null);

	const [state, dispatch] = useReducer(invoicesReducer, {
		selectedProject: null,
		selectedInvoices: [],
	});

	const value = {
		state,
		dispatch,
		filteredProjectId,
		setFilteredProjectId,
		filteredMonth,
		setFilteredMonth,
		filteredYear,
		setFilteredYear,
	};

	return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
};

export const useInvoicesContext = () => {
	const context = useContext(InvoicesContext);
	if (context === undefined) {
		throw new Error('useInvoicesContext must be used within a InvoicesContextProvider');
	}
	return context;
};
