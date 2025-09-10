import { IState } from '@components/drawerNavigator/Filter/FilterContext';
import CONSTANTS from '@constants/constants';

export default function transformFilmFilter(data: IState['filmFilters']): string {
	const filter: Record<string, string> = {};
	let transformed = '';

	if (data.brand?.length > 0) {
		filter.brand_id = data.brand.map(it => it.id).join(',');
	}
	if (data.genre_ids?.length > 0) {
		filter.genre_ids = data.genre_ids.map(it => it.id).join(',');
	}
	if (data.industry_id?.length > 0) {
		filter.industry_id = data.industry_id.map(it => it.id).join(',');
	}
	if (data.language_id?.length > 0) {
		filter.language_id = data.language_id.map(it => it.id).join(',');
	}
	if (data.video_type_id?.length > 0) {
		filter.video_type_id = data.video_type_id.map(it => it.id).join(',');
	}

	if (Array.isArray(data.year_of_release) && (data.year_of_release[0] > CONSTANTS.MIN_RELEASE_YEAR || data.year_of_release[1] < CONSTANTS.MAX_RELEASE_YEAR)) {
		filter.year_of_release = JSON.stringify(data.year_of_release);
	}

	if (Array.isArray(data.duration) && (data.duration[0] > CONSTANTS.MIN_DURATION || data.duration[1] < CONSTANTS.MAX_DRUATION)) {
		filter.duration = JSON.stringify(data.duration);
	}

	if (data.is_verified === 'true' || data.is_verified === 'false') {
		filter.is_verified = data.is_verified;
	}

	for (let [key, value] of Object.entries(filter)) {
		transformed += `${key}=${value}&`;
	}

	if (transformed.endsWith('&')) {
		transformed = transformed.slice(0, -1);
	}

	return transformed;
}
