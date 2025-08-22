import { hexToHsl } from './hexToHsl';
import { hslToHex } from './hslToHex';

export const getColorForProject = (hexColor: string, index: number): string => {
	const { h: baseHue, s: baseSaturation, l: baseLightness } = hexToHsl(hexColor);

	// Calculate saturation, decreasing by 5% for each index, minimum 0%
	const saturationReduction = Math.min(index * 5, 100);
	const newSaturation = Math.max(baseSaturation * (1 - saturationReduction / 100), 0);

	// Create new hex color with extracted hue, calculated saturation, and fixed lightness
	return hslToHex(baseHue, newSaturation, baseLightness);
};
