import CONSTANTS from '@constants/constants';

export default function createAbsoluteImageUri(imageRelativePath: string) {
	if (!imageRelativePath) {
		return '';
	}
	return `${CONSTANTS.DOMAIN}${imageRelativePath}`;
}
