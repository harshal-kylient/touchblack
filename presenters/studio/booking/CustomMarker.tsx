import { darkTheme } from '@touchblack/ui/theme';
import { View } from 'react-native';

export default function CustomMarker() {
	return (
		<View
			style={{
				width: 10,
				height: 10,
				backgroundColor: darkTheme.colors.primary,
			}}
		/>
	);
}
