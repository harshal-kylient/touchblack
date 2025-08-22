import { useState } from 'react';
import { GestureResponderEvent, ImageBackground, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { Favorite, Play } from '@touchblack/icons';
import { SheetManager } from 'react-native-actions-sheet';

import IFilm from '@models/entities/IFilm';
import capitalized from '@utils/capitalized';
import { SheetType } from 'sheets';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { useAuth } from '@presenters/auth/AuthContext';

type CompactFilmItemProps = {
	item: IFilm;
	onPress: (event: GestureResponderEvent) => void;
	blackbook_id: string;
};

function CompactFilmItem({ item, onPress, blackbook_id, ...props }: CompactFilmItemProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [isLiked, setIsLiked] = useState<boolean>(true);
	const { permissions, loginType } = useAuth();
	const active = loginType === 'producer' ? permissions?.includes('Blackbook::Edit') : true;

	const handleLikePress = () => {
		if (!isLiked) {
			setIsLiked(!isLiked);
			return;
		}

		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.UnlikeFilm,
				data: {
					blackbook_id,
					film_ids: [item.id],
					film_name: item.film_name,
				},
			},
		});
	};

	return (
		<TouchableOpacity onPress={onPress} style={styles.filmThumbnailContainer} {...props}>
			<View style={styles.filmThumbnailItem}>
				<ImageBackground
					resizeMode="cover"
					style={styles.backgroundImage}
					source={{
						uri: createAbsoluteImageUri(item?.thumbnail_url || ''),
					}}
				/>
				<Play style={styles.playButton} />
				<View style={styles.filmDetailsContainer}>
					<View style={styles.contentContainer}>
						<Text size="button" numberOfLines={1} ellipsizeMode="tail" style={styles.filmName} color="regular">
							{item.film_name}
						</Text>
						<Text size="bodySm" numberOfLines={1} ellipsizeMode="tail" style={styles.filmInfo} color="regular">
							{item.owner_name ? capitalized(item.owner_name) : capitalized(item.owner_type)} {item.duration ? `| ${item.duration}` : ''}
						</Text>
					</View>
				</View>
				<TouchableOpacity style={styles.likeButton(active!)} disabled={!active} onPress={handleLikePress}>
					<Favorite size="24" fill={isLiked ? theme.colors.destructive : theme.colors.typographyLight} strokeColor={theme.colors.typography} strokeWidth={2} />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
}

export default CompactFilmItem;

const stylesheet = createStyleSheet(theme => ({
	filmThumbnailContainer: {
		minHeight: 100,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.lg,
	},
	filmThumbnailItem: {
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	filmDetailsContainer: {
		flexDirection: 'row',
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingRight: 0,
		paddingVertical: theme.padding.xs,
	},
	contentContainer: {
		height: 'auto',
		flex: 1,
		gap: theme.gap.xxs,
	},
	moreButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	moreButton: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 48,
		height: 48,
		borderRadius: 24,
	},
	backgroundImage: {
		flex: 1,
		justifyContent: 'center',
		width: '100%',
		height: 202,
	},
	filmName: {
		fontFamily: theme.fontFamily.cgBold,
	},
	filmInfo: {
		opacity: 0.8,
	},
	likeButton: (active: boolean) => ({
		position: 'absolute',
		top: 0,
		right: 0,
		opacity: active ? 1 : 0.75,
		justifyContent: 'center',
		alignItems: 'center',
		width: 48,
		height: 48,
	}),
	playButton: { position: 'absolute', top: '30%', left: '46%', width: 48, height: 48, borderRadius: 44 },
}));
