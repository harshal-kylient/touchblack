export default function jsonToFormdata(obj: any, parentKey = '') {
	const formData = new FormData();

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			const newKey = parentKey ? `${parentKey}[${key}]` : key;
			if (value?.uri) {
				const file = {
				  uri: value.uri,
				  type: value.type || 'image/jpeg',
				  name: value.name || value.fileName || 'upload.jpg',
				};
				formData.append(newKey, file);
			  
			} else if (value && typeof value === 'object' && 'id' in value) {
				formData.append(newKey, value.id);
			} else if (value && typeof value === 'object') {
				const subFormData = jsonToFormdata(value, newKey);
				// @ts-ignore
				Array.from(subFormData).forEach(([subKey, subValue]) => {
					formData.append(subKey, subValue);
				});
			} else {
				formData.append(newKey, value);
			}
		}
	}

	return formData;
}
