import { darkTheme } from '@touchblack/ui/theme';

export function primaryOrWhite(active: boolean) {
	return active ? darkTheme.colors.primary : darkTheme.colors.typography;
}
export function blackOrWhite(active: boolean) {
	return active ? darkTheme.colors.black : darkTheme.colors.typography;
}
export function primaryOrNone(active: boolean) {
	return active ? darkTheme.colors.primary : 'none';
}
