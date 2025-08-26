export const transformBlackBookProfessionsData = (data: any) => {
	const blackbookCountAndProfessions = data?.pages.flatMap((page: any) => page?.data) || [];
	if (blackbookCountAndProfessions.length === 0) {
		return { blackbook_count: 0, archived_blackbooks_count: 0, formattedProfessions: [] };
	}

	const [{ blackbooks_count, archived_blackbooks_count, profession_ids }] = blackbookCountAndProfessions;
	const formattedProfessions = profession_ids.map((item: any) => {
		const [id, name] = Object.entries(item)[0];
		return { id, name };
	});

	return { blackbooks_count, archived_blackbooks_count, formattedProfessions };
};
