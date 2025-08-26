export default function enumToArray(enumObj: any): { id: string; name: string }[] {
	return Object.keys(enumObj)
		.filter(key => isNaN(Number(key)))
		.map(key => ({
			id: key,
			name: enumObj[key],
		}));
}
