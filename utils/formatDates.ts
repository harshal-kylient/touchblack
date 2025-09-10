export const formatDates = (dates: (string | Date | null)[]): string => {
	if (!dates) return '';
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const groupedDates = dates.reduce((acc, date) => {
		if (date === null) {
			return acc;
		}

		let dateString: string;
		if (date instanceof Date) {
			dateString = date.toISOString().split('T')[0];
		} else if (typeof date === 'string') {
			dateString = date;
		} else {
			return acc;
		}

		const [year, month, day] = dateString.split('-');
		const monthYear = `${monthNames[parseInt(month) - 1]} ${year}`;
		if (!acc[monthYear]) {
			acc[monthYear] = [];
		}
		acc[monthYear].push(parseInt(day));
		return acc;
	}, {} as Record<string, number[]>);

	return Object.entries(groupedDates)
		.map(([monthYear, days]) => `${days.sort((a, b) => a - b).join(', ')} ${monthYear}`)
		.join(' and ');
};
