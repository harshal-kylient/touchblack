import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define the shape of our context state
interface StudioConversationContextState {
	// The number values that track different phases of the studio session
	total_days: number;
	setup_days: number;
	shoot_days: number;
	dismantle_days: number;
}

// Define the shape of our context including both state and update functions
interface StudioConversationContextValue extends StudioConversationContextState {
	// Functions to update individual day counts
	setTotalDays: (days: number) => void;
	setSetupDays: (days: number) => void;
	setShootDays: (days: number) => void;
	setDismantleDays: (days: number) => void;

	// Function to update all day counts at once
	updateAllDays: (days: Partial<StudioConversationContextState>) => void;

	// Reset function to return all values to defaults
	resetDays: () => void;
}

// Default values for our context
const defaultContextState: StudioConversationContextState = {
	total_days: 0,
	setup_days: 0,
	shoot_days: 0,
	dismantle_days: 0,
};

// Create the context with default values
const StudioConversationContext = createContext<StudioConversationContextValue | undefined>(undefined);

// Props for our context provider
interface StudioConversationProviderProps {
	children: ReactNode;
	initialState?: Partial<StudioConversationContextState>;
}

/**
 * Provider component that wraps your app and makes conversation context available to any
 * child component that calls the useStudioConversationContext hook.
 */
export const StudioConversationProvider: React.FC<StudioConversationProviderProps> = ({ children, initialState = {} }) => {
	// Create state with default values merged with any initial values
	const [state, setState] = useState<StudioConversationContextState>({
		...defaultContextState,
		...initialState,
	});

	// Memoize our context value to prevent unnecessary re-renders
	const contextValue = useMemo(() => {
		// Individual setter functions
		const setTotalDays = (days: number) => {
			setState(prev => ({ ...prev, total_days: days }));
		};

		const setSetupDays = (days: number) => {
			setState(prev => ({ ...prev, setup_days: days }));
		};

		const setShootDays = (days: number) => {
			setState(prev => ({ ...prev, shoot_days: days }));
		};

		const setDismantleDays = (days: number) => {
			setState(prev => ({ ...prev, dismantle_days: days }));
		};

		// Function to update multiple or all values at once
		const updateAllDays = (days: Partial<StudioConversationContextState>) => {
			setState(prev => ({ ...prev, ...days }));
		};

		// Reset function
		const resetDays = () => {
			setState(defaultContextState);
		};

		// Return the complete context value
		return {
			...state,
			setTotalDays,
			setSetupDays,
			setShootDays,
			setDismantleDays,
			updateAllDays,
			resetDays,
			resetContext: resetDays,
		};
	}, [state]);

	// Provide the context value to all children
	return <StudioConversationContext.Provider value={contextValue}>{children}</StudioConversationContext.Provider>;
};

/**
 * Custom hook that lets components subscribe to the studio conversation context
 *
 * @returns The current studio conversation context value
 * @throws Error if used outside of a StudioConversationProvider
 */
export const useStudioConversationContext = (): StudioConversationContextValue => {
	const context = useContext(StudioConversationContext);

	if (context === undefined) {
		throw new Error('useStudioConversationContext must be used within a StudioConversationProvider');
	}

	return context;
};
