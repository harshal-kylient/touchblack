import IAward from '@models/entities/IAward';
import IFilmType from '@models/entities/IFilmType';
import IGenre from '@models/entities/IGenre';
import IIndustry from '@models/entities/IIndustry';
import IInstitute from '@models/entities/IInstitute';
import ILanguage from '@models/entities/ILanguage';
import ILocation from '@models/entities/ILocation';
import IWorkWith from '@models/entities/IWorkWith';
import { Dispatch, createContext, useContext, useReducer } from 'react';
import getCurrentFilter from './getCurrentFilter';
import CONSTANTS from '@constants/constants';
import cloneDeep from 'lodash.clonedeep';

interface IFilterContext {
	state: IState;
	dispatch: Dispatch<IAction>;
}

export interface IState {
	talentsData: any[];
	filmsData: any[];
	producersData: any[];
	talentFilters: {
		profession_type: string;
		works_with: IWorkWith[];
		brand: string[];
		industry_id: IIndustry[];
		year_of_release: [number, number] | undefined;
		video_type_id: IFilmType[];
		location_id: ILocation[];
		duration: [number, number] | undefined;
		language_id: ILanguage[];
		institutes_ids: IInstitute[];
		award_ids: IAward[];
		rate_per_shoot_day: [number, number] | undefined;
	};
	filmFilters: {
		video_type_id: IFilmType[];
		brand: string[];
		industry_id: IIndustry[];
		genre_ids: IGenre[];
		language_id: ILanguage[];
		year_of_release: [number, number] | undefined;
		duration: [number, number] | undefined;
		is_verified:string
	};
	producerFilters: {
		video_type_id: IFilmType[];
		brand: string[];
		industry_id: IIndustry[];
		genre_ids: IGenre[];
		language_id: ILanguage[];
		year_of_release: [number, number] | undefined;
		duration: [number, number] | undefined;
	};
	query: string;
	activeTab: number;
}

const defaultValues: IFilterContext = {
	dispatch: () => {},
	state: {
		talentsData: [],
		filmsData: [],
		producersData: [],
		talentFilters: {
			profession_type: '',
			works_with: [],
			brand: [],
			industry_id: [],
			year_of_release: [CONSTANTS.MIN_RELEASE_YEAR, CONSTANTS.MAX_RELEASE_YEAR],
			video_type_id: [],
			location_id: [],
			duration: [CONSTANTS.MIN_DURATION, CONSTANTS.MAX_DRUATION],
			language_id: [],
			institutes_ids: [],
			award_ids: [],
			rate_per_shoot_day: [CONSTANTS.MIN_RATE, CONSTANTS.MAX_RATE],
		},
		filmFilters: {
			brand: [],
			video_type_id: [],
			language_id: [],
			genre_ids: [],
			industry_id: [],
			duration: [CONSTANTS.MIN_DURATION, CONSTANTS.MAX_DRUATION],
			year_of_release: [CONSTANTS.MIN_RELEASE_YEAR, CONSTANTS.MAX_RELEASE_YEAR],
			is_verified: '',
		},
		producerFilters: {
			brand: [],
			genre_ids: [],
			industry_id: [],
			language_id: [],
			video_type_id: [],
			duration: [CONSTANTS.MIN_DURATION, CONSTANTS.MAX_DRUATION],
			year_of_release: [CONSTANTS.MIN_RELEASE_YEAR, CONSTANTS.MAX_RELEASE_YEAR],
		},
		activeTab: 0,
		query: '',
	},
};

const FilterContext = createContext<IFilterContext>(defaultValues);

export interface IAction {
	type:
		| 'QUERY'
		| 'TAB_CHANGE'
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
		case 'TAB_CHANGE':
			return { ...state, activeTab: action.value };
		case 'RESET_FILTERS':
			const toReset = state.activeTab === 0 ? 'talentFilters' : state.activeTab === 1 ? 'filmFilters' : 'producerFilters';
			const newState = { ...state, [toReset]: { ...cloneDeep(defaultValues.state[toReset]) } };
			return newState;
		case 'TALENT_ROLES':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], profession_type: action.value } };
		case 'INSTITUTES_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], institutes_ids: [...state[getCurrentFilter(state.activeTab)].institutes_ids, action.value] } };
		case 'INSTITUTES_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], institutes_ids: state[getCurrentFilter(state.activeTab)].institutes_ids.filter(it => it.id !== action.value.id) } };
		case 'WORKED_WITH_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], works_with: [...state[getCurrentFilter(state.activeTab)].works_with, action.value] } };
		case 'WORKED_WITH_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], works_with: state[getCurrentFilter(state.activeTab)].works_with.filter(it => it.id !== action.value.id) } };
		case 'RATE_PER_SHOOT':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], rate_per_shoot_day: action.value } };
		case 'BRANDS_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], brand: [...state[getCurrentFilter(state.activeTab)].brand, action.value] } };
		case 'BRANDS_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], brand: state[getCurrentFilter(state.activeTab)].brand.filter(it => it.id !== action.value.id) } };
		case 'INDUSTRIES_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], industry_id: [...state[getCurrentFilter(state.activeTab)].industry_id, action.value] } };
		case 'INDUSTRIES_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], industry_id: state[getCurrentFilter(state.activeTab)].industry_id.filter(it => it.id !== action.value.id) } };
		case 'LANGUAGES_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], language_id: [...state[getCurrentFilter(state.activeTab)].language_id, action.value] } };
		case 'LANGUAGES_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], language_id: state[getCurrentFilter(state.activeTab)].language_id.filter(it => it.id !== action.value.id) } };
		case 'GENRES_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], genre_ids: [...state[getCurrentFilter(state.activeTab)].genre_ids, action.value] } };
		case 'GENRES_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], genre_ids: state[getCurrentFilter(state.activeTab)].genre_ids.filter(it => it.id !== action.value.id) } };
		case 'AWARDS_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], award_ids: [...state[getCurrentFilter(state.activeTab)].award_ids, action.value] } };
		case 'AWARDS_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], award_ids: state[getCurrentFilter(state.activeTab)].award_ids.filter(it => it.id !== action.value.id) } };
		case 'LOCATIONS_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], location_id: [...state[getCurrentFilter(state.activeTab)].location_id, action.value] } };
		case 'LOCATIONS_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], location_id: state[getCurrentFilter(state.activeTab)].location_id.filter(it => it.id !== action.value.id) } };
		case 'YEAR_OF_RELEASE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], year_of_release: action.value } };
		case 'VIDEO_TYPE_ADD':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], video_type_id: [...state[getCurrentFilter(state.activeTab)].video_type_id, action.value] } };
		case 'VIDEO_TYPE_REMOVE':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], video_type_id: state[getCurrentFilter(state.activeTab)].video_type_id.filter(it => it.id !== action.value.id) } };
		case 'DURATION':
			return { ...state, [getCurrentFilter(state.activeTab)]: { ...state[getCurrentFilter(state.activeTab)], duration: action.value } };
		default:
			return state;
	}
};

export function FilterProvider(props: any) {
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
