import IAvailableTalent from '@models/dtos/IAvailableTalent';
import React, { Dispatch, createContext, useContext, useReducer } from 'react';

interface IProjectDetails {
	video_type_id: {
		id: UniqueId;
		name: string;
	} | null;
	brand_id: {
		id: UniqueId;
		name: string;
	} | null;
	project_name: string;
	project_id: UniqueId | null;
	location_ids: { id: UniqueId; name: string }[];
	film_brief: string;
	film_brief_attachment: any;
}

interface ITalentSelectionDetails {
	project_invitations: {
		dates: string[];
		from_time: string;
		to_time: string;
		profession_id: {
			id: UniqueId;
			name: string;
		};
		project_id: UniqueId;
		talent_ids: IAvailableTalent[];
	}[];
}

export enum ViewType {
	GRID,
	LIST,
}

interface IState {
	default?: {
		project_details: IProjectDetails;
		talent_selection_details: ITalentSelectionDetails;
	};
	query: string;
	talent_type_query: string;
	project_query: string;
	active_view: ViewType;
	add_to_project: {
		talent_id: UniqueId;
		profession_id: UniqueId;
		profession_name: string;
	};
	current_step: number;
	project_details: IProjectDetails;
	project_details_default: IProjectDetails;
	talent_selection_details: ITalentSelectionDetails;
	talent_selection_details_default: ITalentSelectionDetails;
}

interface IAction {
	type:
		| 'QUERY'
		| 'CLEAR_ADD_TO_PROJECT'
		| 'ADD_TO_PROJECT'
		| 'PROJECT_DETAILS_DEFAULT'
		| 'TALENT_SELECTION_DEFAULT'
		| 'PROJECT_ID'
		| 'PROJECT_NAME'
		| 'DEFAULT_VALUES'
		| 'RESET'
		| 'ACTIVE_VIEW'
		| 'TALENT_TYPE_QUERY'
		| 'PROJECT_QUERY'
		| 'CURRENT_STEP'
		| 'PROJECT_DETAILS'
		| 'TALENT_SELECTION_ADD_PROFSSION'
		| 'TALENT_SELECTION_DATES'
		| 'TALENT_SELECTION_REMOVE_PROFESSION'
		| 'TALENT_SELECTION_ADD_TALENT'
		| 'TALENT_SELECTION_REMOVE_TALENT'
		| 'TALENT_SELECTION_REMOVE_ALL_TALENTS'
		| 'TALENT_SELECTION_REMOVE_TALENT_KEEP_PROFESSION'
		| 'TALENT_SELECTION'
		| 'VIDEO_TYPE';
	value?: any;
}

function reducer(state: IState, action: IAction) {
	switch (action.type) {
		case 'QUERY':
			return { ...state, query: action.value };
		case 'RESET':
			return defaultValues.state;
		case 'ACTIVE_VIEW':
			return { ...state, active_view: action.value };
		case 'ADD_TO_PROJECT':
			return { ...state, add_to_project: action.value };
		case 'CLEAR_ADD_TO_PROJECT':
			return { ...state, add_to_project: null };
		case 'TALENT_TYPE_QUERY':
			return { ...state, talent_type_query: action.value };
		case 'PROJECT_QUERY':
			return { ...state, project_query: action.value };
		case 'CURRENT_STEP':
			return { ...state, current_step: action.value };
		case 'PROJECT_DETAILS':
			return { ...state, project_details: action.value };
		case 'PROJECT_DETAILS_DEFAULT':
			return { ...state, project_details_default: action.value };
		case 'PROJECT_ID':
			return {
				...state,
				project_details: {
					...state.project_details,
					project_id: action.value,
				},
			};
		case 'PROJECT_NAME':
			return {
				...state,
				project_details: {
					...state.project_details,
					project_name: action.value,
				},
			};
		case 'VIDEO_TYPE':
			return {
				...state,
				project_details: {
					...state.project_details,
					video_type_id: action.value,
				},
			};
		case 'DEFAULT_VALUES':
			return {
				...state,
			};
		case 'TALENT_SELECTION_ADD_PROFSSION':
			return {
				...state,
				talent_selection_details: {
					project_invitations: [
						...state.talent_selection_details.project_invitations,
						{
							dates: [],
							profession_id: action.value,
							project_id: null,
							talent_ids: [],
						},
					],
				},
			};
		case 'TALENT_SELECTION_REMOVE_PROFESSION':
			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.filter(it => it.profession_id.id !== action.value.id),
				},
			};
		case 'TALENT_SELECTION_DATES':
			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.map(it => {
						if (it.profession_id.id === action.value.profession.id) {
							return {
								...it,
								dates: action.value.dates,
								from_time: action.value.from_time,
								to_time: action.value.to_time,
							};
						}
						return it;
					}),
				},
			};
		case 'TALENT_SELECTION_ADD_TALENT':
			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.map(it => {
						if (it.profession_id.id === action.value.profession.id) {
							return {
								...it,
								talent_ids: [...it.talent_ids, action.value.talent],
							};
						}
						return it;
					}),
				},
			};
		case 'TALENT_SELECTION_REMOVE_TALENT_KEEP_PROFESSION':
			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.map(it => {
						if (it.profession_id.id === action.value.profession.id) {
							return {
								...it,
								talent_ids: it.talent_ids.filter(item => item.id !== action.value.talent.id),
							};
						}
						return it;
					}),
				},
			};
		case 'TALENT_SELECTION_REMOVE_TALENT':
			const invite_details = state.talent_selection_details.project_invitations.find(it => it.profession_id.id === action.value.profession.id);
			if (invite_details?.talent_ids.length === 1) {
				return {
					...state,
					talent_selection_details: {
						project_invitations: state.talent_selection_details.project_invitations.filter(it => it.profession_id.id !== action.value.profession.id),
					},
				};
			}

			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.map(it => {
						if (it.profession_id.id === action.value.profession.id) {
							return {
								...it,
								talent_ids: it.talent_ids.filter(item => item.id !== action.value.talent.id),
							};
						}
						return it;
					}),
				},
			};
		case 'TALENT_SELECTION_REMOVE_ALL_TALENTS':
			// set to default values || []
			let defaultTalents: any;
			for (let it of state.talent_selection_details_default.project_invitations) {
				if (it.profession_id.id === action.value.profession.id) {
					defaultTalents = it.talent_ids;
				}
			}

			return {
				...state,
				talent_selection_details: {
					project_invitations: state.talent_selection_details.project_invitations.map(it => {
						if (it.profession_id.id === action.value.profession.id) {
							return {
								...it,
								talent_ids: defaultTalents || [],
							};
						}
						return it;
					}),
				},
			};
		case 'TALENT_SELECTION':
			return {
				...state,
				talent_selection_details: {
					project_invitations: action.value,
				},
			};
		case 'TALENT_SELECTION_DEFAULT':
			return {
				...state,
				talent_selection_details_default: {
					project_invitations: action.value,
				},
			};
		default:
			return state;
	}
}

const defaultValues: IProjectContext = {
	state: {
		query: '',
		talent_type_query: '',
		active_view: ViewType.GRID,
		project_query: '',
		current_step: 0,
		project_details_default: {
			brand_id: null,
			project_id: null,
			film_brief: '',
			film_brief_attachment: null,
			location_ids: [],
			project_name: '',
			video_type_id: null,
		},
		project_details: {
			brand_id: null,
			project_id: null,
			film_brief: '',
			film_brief_attachment: null,
			location_ids: [],
			project_name: '',
			video_type_id: null,
		},
		talent_selection_details: {
			project_invitations: [],
		},
		talent_selection_details_default: {
			project_invitations: [],
		},
	},
	dispatch: () => {},
};

interface IProjectContext {
	state: IState;
	dispatch: Dispatch<IAction>;
}

const ProjectContext = createContext<IProjectContext>(defaultValues);
export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(reducer, defaultValues.state);

	return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>;
};

export const useProjectsContext = () => {
	const context = useContext(ProjectContext);
	if (context === undefined) {
		throw new Error('useProjects must be used within a ProjectProvider');
	}
	return context;
};
