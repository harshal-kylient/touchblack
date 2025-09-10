export default function formatNumber(text: string | number) {
	return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
