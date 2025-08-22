import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Bookmark } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import ITalentAbout from '@models/entities/ITalentAbout';
import { useState } from 'react';

function BookmarkProfile({ talentData }: { talentData: ITalentAbout }) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const isBookmarked = talentData?.is_bookmarked || false;


	const handleBookmark = () => {
		if (!talentData?.is_bookmarked) {
			navigation.navigate('AddToBlackBook', { talentData: talentData });
		}
	};

	return (
		<TouchableOpacity onPress={handleBookmark} style={styles.iconContainer}>
			<Bookmark fill={isBookmarked ? theme.colors.primary : theme.colors.transparent} strokeColor={theme.colors.primary} strokeWidth={3} size="24" />
		</TouchableOpacity>
	);
}

const stylesheet = createStyleSheet(theme => ({
	iconContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: '100%',
		aspectRatio: 1 / 1,
		height: '100%',
	},
}));

export default BookmarkProfile;
