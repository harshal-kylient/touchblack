import { Text } from '@touchblack/ui';
import { Image, TouchableOpacity, View } from 'react-native';
import ContentRow from '../../ContentRow';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Bookmark, Person } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import ITalentSearch from '@models/dtos/ITalentSearch';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import iconmap from '@utils/iconmap';

type WorkedWithListItemProps = {
	index: number;
	item: ITalentSearch;
};

function WorkedWithListItem({ item }: WorkedWithListItemProps) {
	const { styles, theme } = useStyles(stylesheet);
	const PersonIcon = () => <Person color={theme.colors.muted} />;
	const Icon = iconmap(theme.colors.muted)[item.profession.toLowerCase()] || PersonIcon;
	const navigation = useNavigation();

	function handleWorkedWithButtonKeyPress(talentId: string) {
		navigation.navigate('TalentProfile', { id: talentId });
	}

	return (
		<TouchableOpacity onPress={() => handleWorkedWithButtonKeyPress(item.id)} style={styles.WorkedWithListItemContainer}>
			<View style={styles.separatorView} />
			<View style={styles.imageContainer}>{item.profile_picture_url ? <Image style={styles.WorkedWithListImage} source={{ uri: createAbsoluteImageUri(item.profile_picture_url) }} /> : <Icon />}</View>
			<ContentRow customStyle={styles.contentRowContainer} leftSideChildren={leftContent(item, styles)} rightSideChildren={rightContent(styles, navigation)} />
		</TouchableOpacity>
	);
}

function leftContent(item: ITalentSearch, styles: ReturnType<typeof stylesheet>) {
	return (
		<View style={styles.leftContentContainer}>
			<Text color="regular" size="bodyBig">
				{item.first_name || ''} {item.last_name || ''}
			</Text>
			<Text color="muted" size="bodyMid">
				{item.profession}
			</Text>
		</View>
	);
}

function rightContent(styles: ReturnType<typeof stylesheet>, navigation: ReturnType<typeof useNavigation>) {
	const handleBookmark = () => {
		navigation.navigate('Blackbook');
	};

	return (
		<View style={styles.rightContentContainer}>
			<TouchableOpacity onPress={handleBookmark}>
				<Bookmark color={'none'} size="24" strokeColor={'white'} />
			</TouchableOpacity>
		</View>
	);
}

export default WorkedWithListItem;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 64,
		height: 64,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	WorkedWithListImage: {
		width: '100%',
		height: '100%',
	},
	WorkedWithListItemContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentRowContainer: {
		width: 'auto',
		flexGrow: 1,
	},
	separatorView: {
		width: 16,
	},
	leftContentContainer: {
		gap: theme.padding.notificationDot,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
	},
}));
