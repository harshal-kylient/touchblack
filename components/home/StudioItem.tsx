import { ImageBackground, TouchableOpacity, View } from 'react-native';

import { Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import { Person } from '@touchblack/icons';

import ITalentSearch from '@models/dtos/ITalentSearch';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import iconmap from '@utils/iconmap';

type IProps = {
	item: ITalentSearch;
	index: number;
	onPress: (index: number) => void;
};

function StudioItem({ item, index, onPress }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const PersonIcon = () => <Person color={theme.colors.muted} size="90" />;

	const Icon = iconmap(theme.colors.muted, 90)[item?.talent_role?.toLowerCase()] || PersonIcon;

	return (
		<View style={styles.TalentThumbnailItem}>
			<TouchableOpacity style={styles.backgroundImage(!item?.profile_picture_url)} onPress={() => onPress(index)}>
				{item?.cover_photo_url ? <ImageBackground resizeMode="cover" style={styles.backgroundImage(!item.cover_photo_url)} source={{ uri: createAbsoluteImageUri(item?.cover_photo_url) }} /> : <Icon />}
			</TouchableOpacity>
			<View style={styles.contentRow}>
				<View style={styles.contentContainer}>
					<TouchableOpacity onPress={() => onPress(index)} style={{ gap: 4 }}>
						<Text color="regular" numberOfLines={1} size="bodyBig">
							{capitalized(item?.name)}
						</Text>
						<Text color="muted" numberOfLines={1} size="bodyMid">
							{capitalized(item?.city) + ', ' + capitalized(item?.locality)}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

export default StudioItem;

const stylesheet = createStyleSheet(theme => ({
	TalentThumbnailItem: {
		display: 'flex',
		gap: 5,
		width: 180,
		aspectRatio: 1 / 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: darkTheme.borderWidth.slim,
		borderColor: darkTheme.colors.borderGray,
	},
	backgroundImage: (isIcon: boolean) => ({
		flex: 1,
		alignItems: 'center',
		paddingBottom: isIcon ? 58 : 0,
		justifyContent: 'center',
		width: '100%',
		height: '100%',
	}),
	contentRow: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		gap: theme.padding.xxxs,
		alignItems: 'flex-start',
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
	},
	iconContainer: {},
	bookmarkButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'flex-end',
	},
}));
