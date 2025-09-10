export const transformBlackBookData = (data: any) => {
	// 1. get profession name from the data to be the title of accordion
	// 2. get the data of the profession to be the content of the accordion
	// 3. return the data in the format of { title: string, content: [] }
	const professionNames = data.pages.flatMap((page: any) => page.map((item: any) => item.profession_type));
	const uniqueProfessionNames = [...new Set(professionNames)];

	// Create an array of objects { title: string, content: [] }
	const formattedData = uniqueProfessionNames.map(professionName => {
		const content = data.pages.flatMap((page: any) => page.filter((item: any) => item.profession_type === professionName));
		return { title: professionName, content };
	});

	return formattedData;
};
