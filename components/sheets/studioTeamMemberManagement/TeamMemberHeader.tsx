import { Image, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Person } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

export const TeamMemberHeader = ({ userName, userRole, profilePictureUrl }: { userName: string; userRole: string; profilePictureUrl: string | undefined }) => {
	const { styles, theme } = useStyles(stylesheet);
	return (
		<View style={styles.teamMemberContainer}>
			<View style={styles.imgContainer}>{profilePictureUrl ? <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} /> : <Person color={theme.colors.muted} />}</View>
			<View style={styles.teamMemberDetails}>
				<Text size="bodyBig" color="regular" weight="bold" style={styles.memberName} numberOfLines={1}>
					{userName}
				</Text>
				<Text size="bodySm" color="regular" style={styles.memberRole} numberOfLines={1}>
					{userRole}
				</Text>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	teamMemberContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingLeft: theme.margins.base,
		borderBottomWidth: theme.borderWidth.slim,
		marginBottom: theme.margins.xxl,
	},
	teamMemberDetails: {
		flex: 1,
		gap: 2,
		marginLeft: theme.margins.base,
	},
	imgContainer: {
		aspectRatio: 1,
		width: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	profilePicture: {
		flex: 1,
		height: 64,
		width: 64,
	},
	memberName: {
		lineHeight: 22,
		opacity: 0.8,
	},
	memberRole: {
		lineHeight: 14,
		opacity: 0.8,
	},
}));
