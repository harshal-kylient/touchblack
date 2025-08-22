export default function truncate(text: string, limit: number = 10): string {
	if (!text || text?.length === 0) {
		return '';
	}
	if (text.length <= limit) {
		return text;
	}
	return text.slice(0, limit) + '...';
}
