import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Upcoming from '@components/errors/Upcoming';

function EventChats() {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.upcomingContainer}>
			<Upcoming />
		</View>
	);
}

export default EventChats;

const stylesheet = createStyleSheet(theme => ({
	upcomingContainer: { flex: 1, backgroundColor: theme.colors.black, marginTop: theme.margins.base * 5 },
}));
