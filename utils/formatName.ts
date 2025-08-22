import capitalized from '@utils/capitalized';

export default function formatName(...args: string[]) {
	let name = '';
	for (let i = 0; i < args.length; i++) {
		name += args[i] || '';
		name += ' ';
	}
	return capitalized(name.trim());
}
