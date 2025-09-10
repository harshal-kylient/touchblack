import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { Person } from '@touchblack/icons';

interface TeamMemberProps {
	id: number;
	firstName: string;
	lastName: string;
	role?: string;
	studio?: string;
	profilePictureUrl?: string;
	onPress: (id: number) => void;
	isLast: boolean;
}

const TeamMember: React.FC<TeamMemberProps> = ({ id, firstName, lastName, profilePictureUrl, onPress, isLast }) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<Pressable onPress={() => onPress(id)} style={styles.container(isLast)} accessibilityRole="button">
			<View style={styles.imgContainer}>{profilePictureUrl ? <Image source={{ uri: profilePictureUrl }} style={styles.image} /> : <Person color={theme.colors.muted} />}</View>
			<View style={styles.details}>
				<Text size="bodyBig" color="regular" weight="bold" style={styles.name} numberOfLines={1}>
					{firstName} {lastName}
				</Text>
				{/* <Text size="bodySm" color="regular" style={{ lineHeight: 14, opacity: 0.8 }} numberOfLines={1}>
					{role ? role : 'No role'} | {studio ? studio : 'No studio'}
				</Text> */}
			</View>
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	imgContainer: {
		aspectRatio: 1,
		width: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	image: {
		flex: 1,
		height: 64,
		width: 64,
	},
	name: {
		lineHeight: 22,
		opacity: 0.8,
	},
	container: (isLast: boolean) => ({
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: isLast ? theme.borderWidth.slim : 0,
		paddingLeft: theme.margins.base,
	}),
	details: {
		flex: 1,
		gap: 2,
		marginLeft: theme.margins.base,
	},
}));

export default TeamMember;
