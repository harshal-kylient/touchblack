import { View } from 'react-native';
import TextPlaceholder from './TextPlaceholder';

function StudioWelcomPlaceholder() {
	return (
		<View style={{ gap: 60 }}>
			<TextPlaceholder />
			<View>
				<TextPlaceholder customWidth="100%" customHeight={32} />
				<TextPlaceholder customWidth="60%" customHeight={32} />
			</View>
			<TextPlaceholder numberOfLines={4} customWidth="100%" customHeight={16} />
		</View>
	);
}

export default StudioWelcomPlaceholder;
