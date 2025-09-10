import { IFilmProps } from '@presenters/blackBook/FilmThumbnailItemForBlackBook';

export enum Priorities {
	High = 'High',
	Medium = 'Medium',
	Low = 'Low',
}

export const buildHeaderName = (firstName?: string, lastName?: string): string => {
	if (firstName && lastName && firstName.length + lastName.length > 15) {
		return `${firstName} to Favourite`;
	} else if (firstName && lastName) {
		return `${firstName} ${lastName} to Favourite`;
	} else if (firstName) {
		return `${firstName} to Favourite`;
	} else if (lastName) {
		return `${lastName} to Favourite`;
	} else {
		return 'to Favourite';
	}
};

export const PrioritiesData = Object.keys(Priorities).map(key => ({
	id: key,
	name: Priorities[key as keyof typeof Priorities],
}));

export const handleRadioPress = (name: string, field: any) => {
	field.onChange(name);
};

/* films can either be an array of film objects ((i named that as likedFilms)) (navigating from blackbook talent profile) or an array of film names (navigating from talent searches) */

// if films is an array of film names it means we are navigating from talent searches and no films are preloaded, so no checkboxes would be checked, else if films is an array of film objects ((likedFilms)), we need to select the films that are fetched using useGetFilmsOfTalentAsCrew and render checkboxes for them

export function getLikedFilms(films: IFilmProps[]) {
	let likedFilmIds: string[] = [];
	if (films?.length > 0 && typeof films[0] === 'string') {
		// these are not the liked films but all of the films of that talent
		likedFilmIds = [];
	} else {
		likedFilmIds = films?.map((film: IFilmProps) => film.id) || [];
	}
	return likedFilmIds;
}

export function filterFilms(films: IFilmProps[], searchQuery: string) {
	return films.filter((film: IFilmProps) => film.film_name?.toLowerCase().includes(searchQuery.toLowerCase()));
}
