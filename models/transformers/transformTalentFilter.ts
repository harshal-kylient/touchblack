import { IState } from '@components/drawerNavigator/Filter/FilterContext';
import CONSTANTS from '@constants/constants';

export default function transformTalentFilter(data: IState['talentFilters']): string {
	const filter: Partial<IState['talentFilters']> = {};
	let transformed = '';

	if (data?.profession_type) {
		filter.profession_type = data.profession_type?.toLowerCase();
	}
	if (data?.works_with?.length > 0) {
		filter.works_with = data.works_with.map(it => it.id).join(',');
	}
	if (data?.brand?.length > 0) {
		filter.brand_id = data.brand.map(it => it.id).join(',');
	}
	if (data?.industry_id?.length > 0) {
		filter.industry_id = data.industry_id.map(it => it.id).join(',');
	}
	if (data?.year_of_release?.[0] > CONSTANTS.MIN_RELEASE_YEAR || data?.year_of_release?.[1] < CONSTANTS.MAX_RELEASE_YEAR) {
		filter.year_of_release = JSON.stringify(data.year_of_release);
	}
	if (data?.video_type_id?.length > 0) {
		filter.video_type_id = data.video_type_id.map(it => it.id).join(',');
	}
	if (data?.location_id?.length > 0) {
		filter.location_id = data.location_id.map(it => it.id).join(',');
	}
	if (data?.duration?.[0] > CONSTANTS.MIN_DURATION || data?.duration?.[1] < CONSTANTS.MAX_DRUATION) {
		filter.duration = JSON.stringify(data.duration);
	}
	if (data?.language_id?.length > 0) {
		filter.language_id = data.language_id.map(it => it.id).join(',');
	}
	if (data?.institutes_ids?.length > 0) {
		filter.institutes_ids = data.institutes_ids.map(it => it.id).join(',');
	}
	if (data?.award_ids?.length > 0) {
		filter.award_ids = data.award_ids.map(it => it.id).join(',');
	}
	if (data?.rate_per_shoot_day?.[0] > CONSTANTS.MIN_RATE || data?.rate_per_shoot_day?.[1] < CONSTANTS.MAX_RATE) {
		filter.rate_per_shoot_day = JSON.stringify(data.rate_per_shoot_day);
	}
	for (let [key, value] of Object.entries(filter)) {
		transformed += `${key}=${value}&`;
	}
	return transformed;
}
