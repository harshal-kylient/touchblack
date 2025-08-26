import Header from '@components/Header';
import { SafeAreaView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function LocationVideoList({ route }) {
	const { styles, theme } = useStyles(stylesheet);
	const filmDetails = route?.params?.filmDetails;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
			<Header name="Location Video" />
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({}));
