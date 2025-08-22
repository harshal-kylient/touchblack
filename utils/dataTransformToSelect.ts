type IObject = { [key: string]: any };

export default function dataTransformToSelect(data: IObject[]) {
	return data.map(item => ({ id: item.id, name: item.name }));
}
