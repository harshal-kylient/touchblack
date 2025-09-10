import { View, FlatList } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import FilmItemWithComment from '@components/FilmItemWithComment';

function LatestReleaseComponent({ data }) {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.mostViewedFilmsContainer}>
			<LabelWithTouchableIcon isHidden label="Latest Release" />
			<View style={styles.filmItemsContainer}>
				<FlatList
					scrollEnabled={false}
					data={data}
					renderItem={({ item: film }) => (
						<View
							style={{
								borderTopWidth: theme.borderWidth.slim,
								marginBottom: theme.padding.base,
								borderBottomWidth: theme.borderWidth.slim * 2,
								borderColor: theme.colors.borderGray,
							}}>
							<FilmItemWithComment showPinned={false} key={film?.film_id} onPress={() => {}} film={film} />
						</View>
					)}
					keyExtractor={film => film?.film_id || ''}
				/>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	mostViewedFilmsContainer: {},
	filmItemsContainer: {
		flex: 1,
		position: 'relative',
		paddingTop: theme.padding.sm,
	},
}));

export default LatestReleaseComponent;
