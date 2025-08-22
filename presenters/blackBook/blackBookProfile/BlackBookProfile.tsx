import { SafeAreaView, ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, RouteProp } from '@react-navigation/native';

import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import ProfileHeader from './ProfileHeader';
import ProfileNote from './ProfileNote';
import LikedFilms from './LikedFilms';
import { Pencil } from '@touchblack/icons';
import Header from '@components/Header';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetBookmarkedFilms from '@network/useGetBookmarkedFilms';

type RootStackParamList = {
	BlackBookProfile: {
		item: IBlackBookProfile;
	};
	AddToBlackBook: {
		talentData: IBlackBookProfile;
	};
};

type BlackBookProfileRouteProp = RouteProp<RootStackParamList, 'BlackBookProfile'>;

interface IBlackBookProfileProps {
	route: BlackBookProfileRouteProp;
}

function BlackBookProfile({ route }: IBlackBookProfileProps) {
	const { item }: { item: IBlackBookProfile } = route.params;
	const bookmark_id = route?.params?.item?.bookmark_id;
	const { styles, theme } = useStyles(stylesheet);
	const { permissions, loginType } = useAuth();

	const { data: response } = useGetBookmarkedFilms(item?.id);
	const blackbook_id = response?.data?.id;
	const bookmarkedFilms = response?.data?.films || [];
	const bookmark_connection = response?.data?.connection_level;
	const bookmark_notes = response?.data?.notes;
	const bookmark_rating = response?.data?.rating;
	const bookmark_name = response?.data?.bookmark_name;

	const editAllowed = loginType === 'producer' ? permissions?.includes('Blackbook::Edit') : true;
	const navigation = useNavigation();

	const handleEditPress = () => {
		navigation.navigate('AddToBlackBook', {
			talentData: {
				rating: bookmark_rating,
				notes: bookmark_notes,
				bookmark_id,
				bookmark_name,
				blackbook_id,
				id: item?.id,
				user_id: item?.user_id,
				films: bookmarkedFilms,
				first_name: item?.name,
				last_name: item?.name,
				profession_type: item?.profession,
			},
		});
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView style={styles.blackBookProfileScreenContainer}>
				<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
				<Header name={'Favourite Profile'}>
					<TouchableOpacity disabled={!editAllowed} style={styles.editButton(!editAllowed)} onPress={handleEditPress}>
						<Pencil size={'24'} />
					</TouchableOpacity>
				</Header>
				<View style={styles.blackBookProfileContainer}>
					<ProfileHeader connection_level={bookmark_connection} rating={bookmark_rating} name={bookmark_name} profession_type={item?.profession} profile_picture_url={item?.profile_picture_url} />
					<ProfileNote notes={bookmark_notes} />
					<LikedFilms blackbook_id={blackbook_id} item={bookmarkedFilms} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default BlackBookProfile;

const stylesheet = createStyleSheet(theme => ({
	safeArea: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	blackBookProfileScreenContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	blackBookProfileContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	editButton: (disabled: boolean) => ({
		flex: 1,
		width: 48,
		height: 48,
		maxWidth: 48,
		alignItems: 'flex-end',
		justifyContent: 'center',
		opacity: disabled ? 0.6 : 1,
	}),
}));
