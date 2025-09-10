import useGetTalentCalendarList from './useGetTalentCalendarList';

export default function useGetAllTalentProjectsByDate(talent_id: UniqueId, year_month: string, dateString: string) {
	const { data } = useGetTalentCalendarList(talent_id, year_month);
	return data?.[dateString];
}
