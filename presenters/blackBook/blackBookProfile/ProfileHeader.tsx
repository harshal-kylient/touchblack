import { View, Image } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, Tag, TagTypes } from '@touchblack/ui';

import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { Person } from '@touchblack/icons';
import { darkTheme } from '@touchblack/ui/theme';
import capitalized from '@utils/capitalized';

interface ProfileHeaderProps {
	profile_picture_url: string;
	name: string;
	profession_type: string;
	rating: string;
	connection_level: string;
}

const ProfileHeader = ({ profile_picture_url, name, profession_type, rating, connection_level }: ProfileHeaderProps) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.blackBookProfileHeader}>
			<View style={styles.separatorView} />
			<View style={styles.imageContainer(profile_picture_url)}>
				{profile_picture_url ? (
					<Image style={styles.listImage} source={{ uri: createAbsoluteImageUri(profile_picture_url) }} />
				) : (
					<View style={{ borderLeftWidth: darkTheme.borderWidth.slim, borderRightWidth: darkTheme.borderWidth.slim, borderColor: darkTheme.colors.borderGray }}>
						<Person size="92" />
					</View>
				)}
			</View>
			<View style={styles.blackBookProfileHeaderContentContainer}>
				<View style={styles.blackBookProfileHeaderTextContainer}>
					<Text numberOfLines={1} ellipsizeMode="tail" size="primaryBig" style={{ flex: 1, maxWidth: '90%' }} color="regular">
						{capitalized(name)}
					</Text>
					<Text size="bodyBig" style={styles.blackBookProfileHeaderMetaText} color="regular">
						{profession_type}
						{rating ? ` | ${rating}` : ''}
					</Text>
				</View>
				{connection_level ? <Tag type={'white' as TagTypes} label={connection_level} /> : null}
			</View>
		</View>
	);
};

export default ProfileHeader;

const stylesheet = createStyleSheet(theme => ({
	blackBookProfileHeader: {
		marginTop: theme.margins.base,
		flexDirection: 'row',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	blackBookProfileHeaderContentContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		padding: theme.padding.base,
	},
	blackBookProfileHeaderTextContainer: {
		gap: 4,
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	blackBookProfileHeaderMetaText: {
		opacity: 0.8,
	},
	imageContainer: (url: string) => ({
		width: 88,
		height: 88,
		borderWidth: url ? theme.borderWidth.slim : 0,
		borderColor: theme.colors.borderGray,
	}),
	separatorView: {
		width: 16,
	},
	listImage: {
		width: 92,
		height: 92,
	},
}));
