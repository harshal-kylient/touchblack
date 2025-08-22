export default function capitalized(value: string) {
	return value?.[0] ? `${value?.[0]?.toUpperCase()}${value?.slice(1)}` : '';
}
