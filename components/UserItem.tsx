import { ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import iconmap from '@utils/iconmap';
import capitalized from '@utils/capitalized';
import { Person, Verified } from '@touchblack/icons';

type ImageURL = string;
export interface IProps {
	id: UniqueId;
	image: ImageURL;
	city?: string;
	name: string;
	profession: string;
	connection?: string;
	style?: any;
	verified?: boolean;
	cta?: ReactNode;
	swipeRight?: ReactNode;
	onPress?: () => void;
	personIcon?: boolean;
}

export default function UserItem({ name, profession, image, city, connection, style, verified, cta, onPress, personIcon = false, ...props }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const PersonIcon = () => <Person color={theme.colors.muted} />;
	const Icon = personIcon ? () => <Person color={theme.colors.muted} /> : iconmap(theme.colors.muted)[profession?.toLowerCase()] || PersonIcon;

	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.container(pressed), style]} {...props}>
			<View style={styles.imgContainer}>{image ? <Image src={image} style={{ flex: 1, height: 67, width: 67 }} /> : <Icon color={theme.colors.muted} />}</View>
			<View style={styles.contentContainer}>
				<View style={{ flex: 1 }}>
					<View style={styles.nameContainer}>
						<Text size="button" color="regular" style={styles.nameText} numberOfLines={1}>
							{capitalized(name)}
						</Text>
						{/* {verified && <Verified size="18" color={theme.colors.verifiedBlue} />} */}
					</View>

					{profession ? (
						<Text numberOfLines={1} size="bodySm" style={{ maxWidth: '70%' }} color="muted">
							{capitalized(profession)}
							{city ? ` | ${capitalized(city)}` : ''}
						</Text>
					) : null}
				</View>
				<View style={styles.ctaContainer}>
					{connection && (
						<View style={styles.tagContainer}>
							<Text size="bodySm" color="regular">
								{connection}
							</Text>
						</View>
					)}
					{cta}
				</View>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: (pressed: boolean) => ({
		backgroundColor: theme.colors.black,
		flexDirection: 'row',
		paddingVertical: 0,
		paddingHorizontal: 0,
		opacity: pressed ? 0.8 : 1,
		paddingLeft: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	nameContainer: {
		flexDirection: 'row',
		gap: 5,
	},
	nameText: { maxWidth: '70%' },
	imgContainer: {
		aspectRatio: 1,
		width: 70,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentContainer: {
		flexGrow: 1,
		padding: theme.padding.base,
		flexDirection: 'row',
	},
	ctaContainer: {
		flexDirection: 'row',
		position: 'absolute',
		right: 16,
		top: '50%',
	},
	tagContainer: {
		width: 38,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.typography,
		alignSelf: 'flex-start',
	},
}));
