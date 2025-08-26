export default function toggleElement<T>(element: T, data: Set<T>) {
	if (data.has(element)) {
		data.delete(element);
	} else {
		data.add(element);
	}
	return data;
}
