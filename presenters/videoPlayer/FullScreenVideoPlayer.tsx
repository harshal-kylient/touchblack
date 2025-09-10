import Upcoming from '@components/errors/Upcoming';
import Header from '@components/Header';
import VideoPlayer from '@components/VideoPlayer';
import { Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import extractVideoInfo from '@utils/extractVideoInfo';
import { SafeAreaView, View } from 'react-native';

export default function FullScreenVideoPlayer({ route }) {
	const header = route?.params?.header;
	const desc = route?.params?.desc;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
			<Header name={header} />
			<Text size="button" style={{ paddingHorizontal: 16, paddingBottom:40 }} numberOfLines={1} color="muted">
				{desc}
			</Text>
			<Upcoming />
		</SafeAreaView>
	);
}
