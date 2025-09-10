import { SafeAreaView, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';

const ProjectDetailsLoader = () => {
	const { theme } = useStyles();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<TextPlaceholder customWidth={100} />
			<TabsPlaceholder numberOfTabs={2} />
			<View style={{ marginTop: theme.gap.base }}>
				<TextPlaceholder numberOfLines={1} customWidth={80} customHeight={10} />
				<TextPlaceholder numberOfLines={1} customWidth={60} customHeight={15} />
			</View>
			<View style={{ marginTop: theme.gap.lg }}>
				<TextPlaceholder numberOfLines={1} customWidth={80} customHeight={10} />
				<TextPlaceholder numberOfLines={1} customWidth={60} customHeight={15} />
			</View>
			<View style={{ marginTop: theme.gap.lg }}>
				<TextPlaceholder numberOfLines={1} customWidth={80} customHeight={10} />
				<TextPlaceholder numberOfLines={1} customWidth={60} customHeight={15} />
			</View>
			<View style={{ marginTop: theme.gap.lg }}>
				<TextPlaceholder numberOfLines={1} customWidth={80} customHeight={10} />
				<TextPlaceholder numberOfLines={3} customWidth={90} customHeight={15} />
			</View>
		</SafeAreaView>
	);
};

export default ProjectDetailsLoader;
