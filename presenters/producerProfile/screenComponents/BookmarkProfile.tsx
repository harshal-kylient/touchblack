import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Bookmark } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';

const stylesheet = createStyleSheet(theme => ({
	iconContainer: {
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: '100%',
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		aspectRatio: 1 / 1,
		height: '100%',
	},
}));

function BookmarkProfile() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	const handleBookmark = () => {
		navigation.navigate('Blackbook');
	};

	return (
		<TouchableOpacity onPress={() => handleBookmark} style={styles.iconContainer}>
			<Bookmark strokeColor={theme.colors.black} strokeWidth={3} fill={theme.colors.transparent} size="24" />
		</TouchableOpacity>
	);
}

export default BookmarkProfile;
