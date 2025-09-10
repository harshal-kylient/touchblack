import CONSTANTS from '@constants/constants';
import React, { Dispatch, createContext, useContext, useReducer } from 'react';

interface IDetails {
	city: {
		id: UniqueId;
		name: string;
	} | null;
	dates: string[];
	from_time: string;
	to_time: string;
	set_up: string;
	shoot: string;
	dismantle: string;
	full_day: boolean;
	studio_floor:
		| {
				id: UniqueId;
				name: string;
		  }[]
		| null[];
}

export enum ViewType {
	GRID,
	LIST,
}

interface IState extends IDetails {
	project_id: { id: UniqueId; name: string; video_type: { id: UniqueId; name: string } } | null;
	filters: {
		city_id: {
			id: UniqueId;
			name: string;
		} | null;
		catwalk: boolean;
		is_soundproof: boolean;
		is_air_conditioned: boolean;
		generator_backup: boolean;
		studio_floor_area: [string, string];
		advance_booking_amount: [string, string];
		studio_charges_per_shift: [string, string];
	};
}

interface IAction {
	type: 'RESET_FILTERS' | 'RESET' | 'CITY_FILTER' | 'CATWALK_FILTER' | 'STUDIO_PER_SHIFT_CHARGE_FILTER' | 'ADVANCE_AMOUNT_FILTER' | 'FLOOR_AREA_FILTER' | 'GENERATOR_BACKUP_FILTER' | 'AIR_CONDITION_FILTER' | 'SOUNDPROOF_FILTER' | 'PROJECT_ID' | 'CITY' | 'DATES' | 'FULL_DAY' | 'FROM_TIME' | 'TO_TIME' | 'ADD_STUDIO_FLOOR' | 'REMOVE_STUDIO_FLOOR' | 'SET_UP' | 'SHOOT' | 'DISMANTLE';
	value?: any;
}

function reducer(state: IState, action: IAction) {
	switch (action.type) {
		case 'RESET_FILTERS':
			return { ...state, filters: defaultValues.state.filters };
		case 'CITY':
			return { ...state, city: action.value };
		case 'DATES':
			return { ...state, dates: action.value };
		case 'FULL_DAY':
			return { ...state, full_day: action.value };
		case 'FROM_TIME':
			return { ...state, from_time: action.value };
		case 'TO_TIME':
			return { ...state, to_time: action.value };
		case 'SET_UP':
			return { ...state, set_up: action.value };
		case 'SHOOT':
			return { ...state, shoot: action.value };
		case 'DISMANTLE':
			return { ...state, dismantle: action.value };
		case 'ADD_STUDIO_FLOOR':
			if (state.studio_floor?.findIndex(it => it?.id === action.value?.id) !== -1) return state;
			return { ...state, studio_floor: [...state.studio_floor, action.value] };
		case 'REMOVE_STUDIO_FLOOR':
			return { ...state, studio_floor: state.studio_floor.filter(it => it?.id !== action.value?.id) };
		case 'PROJECT_ID':
			return { ...state, project_id: action.value };
		case 'RESET':
			return defaultValues.state;
		case 'CITY_FILTER':
			return { ...state, filters: { ...state.filters, city_id: action.value } };
		case 'CATWALK_FILTER':
			return { ...state, filters: { ...state.filters, catwalk: action.value } };
		case 'STUDIO_PER_SHIFT_CHARGE_FILTER':
			return { ...state, filters: { ...state.filters, studio_charges_per_shift: action.value } };
		case 'ADVANCE_AMOUNT_FILTER':
			return { ...state, filters: { ...state.filters, advance_booking_amount: action.value } };
		case 'FLOOR_AREA_FILTER':
			return { ...state, filters: { ...state.filters, studio_floor_area: action.value } };
		case 'GENERATOR_BACKUP_FILTER':
			return { ...state, filters: { ...state.filters, generator_backup: action.value } };
		case 'AIR_CONDITION_FILTER':
			return { ...state, filters: { ...state.filters, is_air_conditioned: action.value } };
		case 'SOUNDPROOF_FILTER':
			return { ...state, filters: { ...state.filters, is_soundproof: action.value } };
		default:
			return state;
	}
}

const defaultValues: IContext = {
	state: {
		project_id: null,
		city: null,
		dates: [],
		from_time: '',
		to_time: '',
		full_day: false,
		set_up: '',
		shoot: '',
		dismantle: '',
		studio_floor: [],
		filters: {
			city_id: null,
			catwalk: null,
			is_soundproof: null,
			is_air_conditioned: null,
			generator_backup: null,
			studio_floor_area: [CONSTANTS.MIN_STUDIO_AREA, CONSTANTS.MAX_STUDIO_AREA],
			advance_booking_amount: [CONSTANTS.MIN_STUDIO_RATE, CONSTANTS.MAX_STUDIO_RATE],
			studio_charges_per_shift: [CONSTANTS.MIN_STUDIO_RATE, CONSTANTS.MAX_STUDIO_RATE],
		},
	},
	dispatch: () => {},
};

interface IContext {
	state: IState;
	dispatch: Dispatch<IAction>;
}

const StudioBookingContext = createContext<IContext>(defaultValues);

export const StudioBookingContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, defaultValues.state);

	return <StudioBookingContext.Provider value={{ state, dispatch }}>{children}</StudioBookingContext.Provider>;
};

export const useStudioBookingContext = () => {
	const context = useContext(StudioBookingContext);
	if (context === undefined) {
		throw new Error('useStudioBookingContext must be used within a StudioBookingContextProvider');
	}
	return context;
};
