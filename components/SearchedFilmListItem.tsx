import { Text } from '@touchblack/ui';
import { GestureResponderEvent, ImageBackground, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import videoFallback from '@assets/images/Video_Fallback.png';
import IFilm from '@models/entities/IFilm';
import { formatDuration } from '@utils/formatDuration';
import truncate from '@utils/truncate';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';

type FilmThumbnailItemsProps = {
	item: IFilm;
	onPress: (event: GestureResponderEvent) => void;
	style?: any;
};

function SearchedFilmListItem({ item, onPress, style, ...props }: FilmThumbnailItemsProps) {
	const { styles } = useStyles(stylesheet);
	const owner_name = item?.owner_name
	return (
		<TouchableOpacity style={[styles.filmThumbnailItemContainer, style]} onPress={onPress} {...props}>
			<View style={styles.filmThumbnailItem}>
				<ImageBackground
					resizeMode="cover"
					style={styles.backgroundImage}
					source={
						item?.thumbnail_url
							? {
									uri: createAbsoluteImageUri(item?.thumbnail_url),
							  }
							: videoFallback
					}
				/>
				<View style={styles.blurView}>
					<Text size="button" color="regular" numberOfLines={1}>
						{capitalized(item.film_name)}
					</Text>
					<Text size="bodySm" numberOfLines={1} color="regular" style={styles.subText}>
						{owner_name.length > 25 ? capitalized(owner_name).slice(0, 25) + '...' : capitalized(owner_name)} {item.duration ? ` |  ${formatDuration(item.duration)}` : ''}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default SearchedFilmListItem;

const stylesheet = createStyleSheet(theme => ({
	filmThumbnailItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	filmThumbnailItem: {
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		alignItems: 'center',
	},
	subText: {
		color: theme.colors.muted,
	},
	blurView: {
		flex: 3,
		gap: theme.gap.xxxs,
		justifyContent: 'center',
		paddingLeft: theme.padding.base,
	},
	FilmThumbnailItemActive: {
		backgroundColor: theme.colors.primary,
	},
	backgroundImage: {
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 2,
		justifyContent: 'center',
		height: 67,
	},
}));
