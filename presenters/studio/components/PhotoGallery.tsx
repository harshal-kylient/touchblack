import { SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useRoute } from '@react-navigation/native';
import Gallery from 'react-native-awesome-gallery';
import { useAuth } from '@presenters/auth/AuthContext';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import Header from '@components/Header';
import { Calendar } from '@touchblack/icons';

export default function PhotoGallery() {
	const route = useRoute();
	const { photos } = route.params as { photos: { id: string; url: string }[] };
	const { styles, theme } = useStyles(stylesheet);
	const { studioName } = useAuth();
	const photoSources = photos.map(photo => createAbsoluteImageUri(photo.url));

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header style={styles.header} name={studioName ?? ''} children={<Calendar color="none" size="20" strokeWidth={3} strokeColor={theme.colors.typography} />} />
			<View style={styles.galleryContainer}>
				<Gallery
					data={photoSources}
					keyExtractor={index => `${index}`}
					disableVerticalSwipe
					style={{ backgroundColor: theme.colors.backgroundDarkBlack }}
					containerDimensions={{
						width: UnistylesRuntime.screen.width,
						height: UnistylesRuntime.screen.height - styles.header.height - (StatusBar.currentHeight || 0),
					}}
				/>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {
		height: 60,
	},
	galleryContainer: {
		flex: 1,
		justifyContent: 'center',
	},
}));
