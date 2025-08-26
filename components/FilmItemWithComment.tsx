import { Dimensions, Image, Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useNavigation } from '@react-navigation/native';
import { Comment, Dialogue, Menu, PinFilled, Play, Verified } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import IFilm from '@models/entities/IFilm';
import capitalized from '@utils/capitalized';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { formatDuration } from '@utils/formatDuration';

const width = Dimensions.get('window').width;

type IProps = {
	film: IFilm;
	onPress?: () => void;
	editable?: boolean;
	restricted?: boolean;
	type?: FilmOptionsEnum;
	mutate?: () => void;
};

export default function FilmItemWithComment({ film, type, onPress = () => {}, restricted, editable = false, mutate, ...props }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	function handlePlay() {
		navigation.navigate('VideoPlayer', { id: film?.film_id });
		onPress();
	}

	return (
		<Pressable style={styles.container} onPress={handlePlay} {...props}>
			<View style={styles.image}>{film?.thumbnail_url ? <Image resizeMode="cover" width={width - 2 * theme.padding.base} height={193} style={styles.backgroundImage} source={{ uri: createAbsoluteImageUri(film?.thumbnail_url) }} /> : null}</View>
			{film?.year_of_release && (
				<View style={{ backgroundColor: theme.colors.backgroundLightBlack, position: 'absolute', top: '7.5%', left: '0%', flex: 1 }}>
					<Text size="bodySm" color="regular" style={{ padding: 5 }}>
						{film.year_of_release}
					</Text>
				</View>
			)}
			<View style={styles.playButton}>
				<Play />
			</View>
			<View style={styles.blurView}>
				<View style={styles.blurContainer}>
					<Text size="button" color="regular" numberOfLines={1} style={[styles.boldText, { maxWidth: '95%' }]}>
						{capitalized(film?.film_name)}
					</Text>
					<View style={{ flexDirection: 'row' }}>
						<Text size="bodyMid" numberOfLines={1} color="muted">
							{capitalized(film?.owner_name?.slice(0, 30) + (film?.owner_name?.length > 30 ? '...' : ''))}
						</Text>
						{film?.duration && (
							<View>
								<Text size="bodyMid" color="muted">
									{' '}
									| {typeof film?.duration === 'number' ? formatDuration(film?.duration) : film?.duration}
								</Text>
							</View>
						)}
						{/* {!restricted && (
							<>
								<Verified size="16" color={theme.colors.verifiedBlue} style={styles.verifiedIcon} />
								<Text size="bodyMid" numberOfLines={1} color="muted" style={styles.verifiedText}>
									Verified
								</Text>
							</>
						)} */}
					</View>
				</View>
				<View style={styles.divider} />
				<TouchableOpacity style={styles.commentButton}>
					<Dialogue size="30" />
				</TouchableOpacity>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		position: 'relative',
		flex: 1,
		height: 193,
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: width - 2 * theme.padding.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		marginHorizontal: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	commentButton: {
		width: '18%',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 62,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderRightColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
	},
	divider: {
		borderColor: theme.colors.borderGray,
		borderLeftWidth: 1,
		minHeight: 62,
	},
	verifiedIcon: {
		marginLeft: theme.margins.xs,
	},
	verifiedText: {
		marginLeft: theme.margins.xxxs,
	},
	menuContainer: restricted => ({ position: 'absolute', bottom: 16, right: 8, paddingVertical: 4, paddingHorizontal: 4, opacity: restricted ? 0.25 : 1 }),
	image: { flex: 1, width: width - 2 * theme.padding.base, height: 193, justifyContent: 'center', alignItems: 'center' },
	filmCardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	playButton: { position: 'absolute', top: '30%', left: '46%', width: 48, height: 48, borderRadius: 44 },
	imageContainer: {
		flex: 1,
	},
	blurView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		minHeight: 62,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	blurContainer: {
		flex: 1,
		gap: 2,
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	boldText: {
		width: width - 4 * theme.padding.base,
		overflow: 'hidden',
		fontFamily: 'CabinetGrotesk-Bold',
	},
	backgroundImage: {
		flex: 1,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		width: '100%',
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	pinButton: { position: 'absolute', top: 0, right: 0 },
}));
