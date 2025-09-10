import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { IBlackBookProfile } from '@models/entities/IBlackBookProfile';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import { useNavigation } from '@react-navigation/native';
import NoLikedFilms from '@components/errors/NoLikedFilms';
import CompactFilmItem from './CompactFilmItem';

const LikedFilms = ({ item, blackbook_id }: { item: IBlackBookProfile; blackbook_id: UniqueId }) => {
	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation();

	function handleBlackBookProfileFilmPress(film: IBlackBookProfile['films'][0]) {
		navigation.navigate('VideoPlayer', { id: film?.film_id });
	}

	return (
		<View style={styles.blackBookProfileLikedFilmsContainer}>
			<LabelWithTouchableIcon label={`Liked Films (${item?.length})`} isHidden={true} />
			<View style={styles.getScrollContainerStyles(item?.length)}>
				{item?.length > 0 ? (
					item?.map(film => <CompactFilmItem key={film.id} onPress={() => handleBlackBookProfileFilmPress(film)} blackbook_id={blackbook_id} item={film} />)
				) : (
					<View style={styles.noLikedFilms}>
						<NoLikedFilms />
					</View>
				)}
			</View>
		</View>
	);
};

export default LikedFilms;

const stylesheet = createStyleSheet(theme => ({
	blackBookProfileLikedFilmsContainer: {
		marginTop: theme.margins.xxl,
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.base,
	},
	getScrollContainerStyles: (filmsLength: number) => ({
		borderTopWidth: filmsLength > 0 ? theme.borderWidth.slim : 0,
		borderTopColor: filmsLength > 0 ? theme.colors.borderGray : theme.colors.transparent,
		gap: filmsLength > 0 ? theme.gap.xxl : 0,
		paddingBottom: filmsLength > 0 ? theme.margins.xxl : 0,
		marginTop: filmsLength > 0 ? 0 : theme.margins.xxxl,
	}),
	filmItemContainer: {
		height: 70,
		flexDirection: 'row',
		paddingLeft: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		justifyContent: 'center',
	},
	noLikedFilms: {
		paddingBottom: theme.padding.base,
	},
}));
