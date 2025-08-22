import { GestureResponderEvent, Image, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import videoFallback from '@assets/images/Video_Fallback.png';

import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { IFilmProps } from '@models/entities/IFilmProps';

type FilmThumbnailItemsProps = {
	item: IFilmProps;
	onPress: (event: GestureResponderEvent) => void;
};

function FilmThumbnailItem({ item, onPress, ...props }: FilmThumbnailItemsProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<TouchableOpacity style={styles.filmThumbnailItemContainer} onPress={onPress} {...props}>
			<View style={styles.filmThumbnailItem}>
				<View style={styles.filmThumbnail}>
					<Image resizeMode="cover" style={{ flex: 1 }} source={item?.thumbnail_url ? { uri: createAbsoluteImageUri(item.thumbnail_url) } : videoFallback} />
				</View>
				<View style={styles.textContainer}>
					<Text size="button" style={{ maxWidth: '71%' }} numberOfLines={1} color="regular">
						{capitalized(item.film_name)}
					</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text size="bodySm" numberOfLines={1} color="muted" style={styles.subText}>
							{item.owner_name}
						</Text>
						<Text color="muted" size="bodySm">
							{item.duration ? ` | ${item.duration}` : ''}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default FilmThumbnailItem;

const stylesheet = createStyleSheet(theme => ({
	filmThumbnailItemContainer: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	filmThumbnailItem: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.base,
	},
	textContainer: {
		gap: 4,
	},
	subText: {
		maxWidth: '51%',
	},
	FilmThumbnailItemActive: {
		backgroundColor: theme.colors.primary,
	},
	filmThumbnail: {
		flex: 1,
		justifyContent: 'center',
		width: 118,
		height: 67,
		maxWidth: 118,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
