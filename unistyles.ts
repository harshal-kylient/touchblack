import { UnistylesRegistry } from 'react-native-unistyles';
import { darkTheme } from '@touchblack/ui/theme';

type AppThemes = {
	dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
	export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
	dark: darkTheme,
}).addConfig({
	adaptiveThemes: true,
});
