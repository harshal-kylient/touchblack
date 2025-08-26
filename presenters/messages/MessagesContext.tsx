import { createContext, useContext, useReducer } from 'react';

interface IState {
	dispatch: (val: IAction) => void;
	state: {
		query: string;
		activeTab: number;
	};
}

interface IAction {
	type: 'TAB_CHANGE' | 'QUERY';
	value: any;
}

function reducer(state: IState, action: IAction) {
	switch (action.type) {
		case 'TAB_CHANGE':
			return { ...state, activeTab: action.value };
		case 'QUERY': {
			return { ...state, query: action.value };
		}

		default:
			return state;
	}
}

const defaultValues = {
	dispatch: () => {},
	state: {
		query: '',
		activeTab: 0,
	},
};

const MessagesContext = createContext<IState>(defaultValues);

export function MessagesProvider(props: any) {
	const [state, dispatch] = useReducer(reducer, defaultValues.state);
	const value = { state, dispatch };

	return <MessagesContext.Provider value={value}>{props.children}</MessagesContext.Provider>;
}

export function useMessageContext() {
	const context = useContext(MessagesContext);
	if (context === undefined) {
		throw new Error('useMessages must be used within a MessagesProvider');
	}
	return context;
}
