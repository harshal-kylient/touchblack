import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Bookmark } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useEffect, useState } from 'react';

function BookmarkProfile({ talentId }: { talentId: string }) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { data: talentData } = useGetUserDetailsById('User', talentId);
	const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
	
	useEffect(() => {
		if (talentData?.is_bookmarked !== undefined) {
			setIsBookmarked(talentData.is_bookmarked);
		}
	}, [talentData?.is_bookmarked]);

	const handleBookmark = () => {
		if (isBookmarked) {
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
