import { Dimensions, Image, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useNavigation } from '@react-navigation/native';
import { Hide, Menu, PinFilled, Play, Verified } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import IFilm from '@models/entities/IFilm';
import capitalized from '@utils/capitalized';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import FilmOptionsEnum from '@models/enums/FilmOptionsEnum';
import { formatDuration } from '@utils/formatDuration';

const width = Dimensions.get('window').width;

type IProps = {
	film: IFilm;
	onPress?: () => void;
	editable?: boolean;
	showPinned?: boolean;
	restricted?: boolean;
	type?: FilmOptionsEnum;
	mutate?: () => void;
};

export default function FilmItem({ film, type, onPress = () => {}, restricted, editable = false, showPinned = true, mutate, ...props }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	function handleMenu() {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.FilmOptions,
				data: { film, type, onSuccess: mutate },
			},
		});
	}

	function handlePlay() {
		navigation.navigate('VideoPlayer', { id: film?.film_id });
		onPress();
	}

	return (
		<Pressable style={styles.container} onPress={handlePlay} {...props}>
			<View style={styles.image}>{film?.thumbnail_url ? <Image resizeMode="cover" width={width - 2 * theme.padding.base} height={193} style={styles.backgroundImage} source={{ uri: createAbsoluteImageUri(film?.thumbnail_url) }} /> : null}</View>
			<View style={styles.playButton}>
				<Play />
			</View>
			{showPinned && film?.is_pinned ? <PinFilled size="24" color={theme.colors.typography} style={{ position: 'absolute', top: 8, right: 8 }} /> : null}
			{film?.is_private && <Hide size="24" style={{ position: 'absolute', top: film?.is_pinned ? 36 : 8, right: 8 }} /> }
			<View style={styles.blurView}>
				<View style={styles.blurContainer}>
					<Text size="bodyBig" color="regular" numberOfLines={1} style={[styles.boldText, { maxWidth: '95%' }]}>
						{capitalized(film?.film_name)}
					</Text>
					<View style={styles.secondRow}>
						<Text size="bodyMid" numberOfLines={1} color="muted">
							{capitalized(film?.owner_name?.slice(0, 20) + (film?.owner_name?.length > 20 ? '...' : ''))}
						</Text>
						{film?.duration && (
							<View>
								<Text size="bodyMid" color="muted">
									{' '}
									| {typeof film?.duration === 'number' ? formatDuration(film?.duration) : film?.duration}
								</Text>
							</View>
						)}
						{film?.is_verified && (
							<>
								<View style={styles.verifiedTag}>
									<Verified size="16" color={theme.colors.verifiedBlue} />
									<Text size="bodyMid" numberOfLines={1} color="muted" style={styles.verifiedText}>
										Verified
									</Text>
								</View>
							</>
						)}
					</View>
				</View>
				{editable ? (
					<Pressable onPress={handleMenu} disabled={restricted} style={styles.menuContainer(restricted)}>
						<Menu size="24" strokeColor="white" strokeWidth={3} />
					</Pressable>
				) : null}
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
		borderColor: theme.colors.borderGray,
	},
	secondRow: { flexDirection: 'row', marginTop: theme.margins.xxxs },
	verifiedTag: {
		paddingHorizontal:4,
		borderRadius:10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		marginLeft: theme.margins.xxs,
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
		// minHeight: 60,
		borderTopWidth: 1,
		borderColor: theme.colors.borderGray,
	},
	blurContainer: {
		flex: 1,
		gap: 2,
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	boldText: {
		width: width - 4 * theme.padding.base,
		overflow: 'hidden',
		fontFamily: '700'
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
