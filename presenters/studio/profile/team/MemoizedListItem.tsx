import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { Person } from '@touchblack/icons';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

export type TalentSearchType = {
	id: string;
	first_name: string;
	last_name: string;
	mobile_number: number;
	gender: string;
	films: string[];
	city: string;
	profession: string;
	profession_type: string;
	works_with: string[];
	user_producer_mappings: string[];
	profile_picture_url: string | null;
	studio_name?: string;
};

const MemoizedListItem = React.memo(({ item, isLast, onPress }: { item: TalentSearchType; isLast: boolean; onPress: () => void }) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<Pressable onPress={onPress}>
			<View style={styles.listItemContainer(isLast)}>
				<View style={styles.imageContainer}>{item.profile_picture_url ? <Image source={{ uri: createAbsoluteImageUri(item.profile_picture_url) }} style={styles.listItemImage} /> : <Person color={theme.colors.muted} />}</View>
				<View style={styles.separatorView} />
				<View style={styles.rightContentContainer}>
					<Text color="regular" size="bodyBig">
						{item.first_name + ' ' + item.last_name}
					</Text>
					{/* <Text color="regular" size="bodySm" style={styles.roleText}>
						{item.profession_type || 'No role'}
					</Text> */}
				</View>
			</View>
		</Pressable>
	);
});

const stylesheet = createStyleSheet(theme => ({
	listItemContainer: (isLast: boolean) => ({
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.margins.lg,
		borderBottomWidth: isLast ? theme.borderWidth.slim : 0,
	}),
	imageContainer: {
		aspectRatio: 1,
		width: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	listItemImage: {
		flex: 1,
		height: 64,
		width: 64,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		gap: theme.gap.xxxs,
		justifyContent: 'center',
	},
	roleText: {
		opacity: 0.8,
	},
}));

export default MemoizedListItem;
