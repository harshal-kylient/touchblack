import { ITalent } from './ITalent';
import { ITalentType } from './ITalentType';

export interface ITalentScheduleEntry {
	talentType: ITalentType;
	selectedDates: Date[] | string[];
	selectedTalents: ITalent[];
}
