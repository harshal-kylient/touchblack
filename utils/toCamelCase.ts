export default function toCamelCase(inputString: any): string {
	if (typeof inputString !== 'string') {
		return '';
	}

	const trimmedString = inputString.trim();

	if (trimmedString === '') {
		return '';
	}

	const words = trimmedString.split(' ');

	if (words.length === 1) {
		return words[0].toLowerCase();
	}

	let camelCaseString = words[0].toLowerCase();
	for (let i = 1; i < words.length; i++) {
		const capitalizedWord = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
		camelCaseString += capitalizedWord;
	}

	return camelCaseString;
}
