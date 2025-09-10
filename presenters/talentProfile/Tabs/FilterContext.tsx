import IFilmType from '@models/entities/IFilmType';
import IGenre from '@models/entities/IGenre';
import IIndustry from '@models/entities/IIndustry';
import ILanguage from '@models/entities/ILanguage';
import { Dispatch, createContext, useContext, useReducer } from 'react';
import CONSTANTS from '@constants/constants';
import cloneDeep from 'lodash.clonedeep';

interface IFilterContext {
	state: IState;
	dispatch: Dispatch<IAction>;
}

export interface IState {
	filmsData: [];
	video_type_id: IFilmType[];
	brand: string[];
	industry_id: IIndustry[];
	genre_ids: IGenre[];
	language_id: ILanguage[];
	year_of_release: [number, number] | undefined;
	duration: [number, number] | undefined;
	is_verified: string;
	query: string;
}

const defaultValues: IFilterContext = {
	dispatch: () => {},
	state: {
		filmsData: [],
		brand: [],
		video_type_id: [],
		language_id: [],
		genre_ids: [],
		industry_id: [],
		duration: [CONSTANTS.MIN_DURATION, CONSTANTS.MAX_DRUATION],
		year_of_release: [CONSTANTS.MIN_RELEASE_YEAR, CONSTANTS.MAX_RELEASE_YEAR],
		is_verified: '',
		query: '',
	},
};

const FilterContext = createContext<IFilterContext>(defaultValues);

export interface IAction {
	type:
		| 'QUERY'
		| 'RESET_FILTERS'
		| 'APPLY_FILTERS'
		| 'DATA'
		| 'GET_TALENTS_DATA'
		| 'GET_FILMS_DATA'
		| 'GET_PRODUCERS_DATA'
		| 'TALENT_ROLES'
		| 'INSTITUTES_ADD'
		| 'INSTITUTES_REMOVE'
		| 'WORKED_WITH_ADD'
		| 'WORKED_WITH_REMOVE'
		| 'RATE_PER_SHOOT'
		| 'BRANDS_ADD'
		| 'BRANDS_REMOVE'
		| 'INDUSTRIES_ADD'
		| 'INDUSTRIES_REMOVE'
		| 'LANGUAGES_ADD'
		| 'LANGUAGES_REMOVE'
		| 'GENRES_ADD'
		| 'GENRES_REMOVE'
		| 'AWARDS_ADD'
		| 'AWARDS_REMOVE'
		| 'LOCATIONS_ADD'
		| 'LOCATIONS_REMOVE'
		| 'YEAR_OF_RELEASE'
		| 'VIDEO_TYPE_ADD'
		| 'VIDEO_TYPE_REMOVE'
		| 'DURATION'
		| 'IS_VERIFIED';
	value?: any;
}

const reducer = (state: IState, action: IAction) => {
	switch (action.type) {
		case 'QUERY':
			return { ...state, query: action.value };
		case 'RESET_FILTERS':
			return cloneDeep(defaultValues.state);
		case 'BRANDS_ADD':
			return { ...state, brand: [...state.brand, action.value] };
		case 'BRANDS_REMOVE':
			return { ...state, brand: state.brand.filter(it => it.id !== action.value.id) };
		case 'INDUSTRIES_ADD':
			return { ...state, industry_id: [...state.industry_id, action.value] };
		case 'INDUSTRIES_REMOVE':
			return { ...state, industry_id: state.industry_id.filter(it => it.id !== action.value.id) };
		case 'LANGUAGES_ADD':
			return { ...state, language_id: [...state.language_id, action.value] };
		case 'LANGUAGES_REMOVE':
			return { ...state, language_id: state.language_id.filter(it => it.id !== action.value.id) };
		case 'GENRES_ADD':
			return { ...state, genre_ids: [...state.genre_ids, action.value] };
		case 'GENRES_REMOVE':
			return { ...state, genre_ids: state.genre_ids.filter(it => it.id !== action.value.id) };
		case 'YEAR_OF_RELEASE':
			return { ...state, year_of_release: action.value };
		case 'VIDEO_TYPE_ADD':
			return { ...state, video_type_id: [...state.video_type_id, action.value] };
		case 'VIDEO_TYPE_REMOVE':
			return { ...state, video_type_id: state.video_type_id.filter(it => it.id !== action.value.id) };
		case 'DURATION':
			return { ...state, duration: action.value };
		case 'IS_VERIFIED':
			return { ...state, is_verified: action.value };
		default:
			return state;
	}
};

export function ShowreelFilterProvider(props: any) {
	const [state, dispatch] = useReducer(reducer, defaultValues.state);

	return <FilterContext.Provider value={{ state, dispatch }}>{props.children}</FilterContext.Provider>;
}

export const useFilterContext = () => {
	const context = useContext(FilterContext);
	if (context === undefined) {
		throw new Error('useFilterContext must be used within a FilterProvider');
	}
	return context;
};
