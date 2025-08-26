import { Image, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { Person } from '@touchblack/icons';
import IBlockItem from '@models/entities/IBlockItem';
import { ReactElement } from 'react';
import formatName from '@utils/formatName';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

interface IProps extends IBlockItem {
	cta?: ReactElement;
}

export default function BlockItem({ name, first_name, last_name, profile_picture_url, profession_type, cta }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const connection = null;

	return (
		<View style={styles.container}>
			<View style={styles.imgContainer}>{profile_picture_url ? <Image src={createAbsoluteImageUri(profile_picture_url)} resizeMode="cover" style={{ width: 64, height: 64 }} /> : <Person color={theme.colors.muted} />}</View>
			<View style={styles.contentContainer}>
				<View>
					<Text size="button" color="regular">
						{name ? formatName(name) : formatName(first_name!, last_name!)}
					</Text>
					<Text size="bodySm" color="muted">
						{profession_type || 'Producer'}
					</Text>
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
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		flexDirection: 'row',
		paddingVertical: 0,
		paddingHorizontal: 0,
		paddingLeft: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	imgContainer: {
		width: 68,
		height: 68,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentContainer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		justifyContent: 'space-between',
	},
	ctaContainer: {
		flexDirection: 'row',
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
