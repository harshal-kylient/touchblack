import React, { useCallback } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Avatar, Text } from '@touchblack/ui';
import { Pencil, Person } from '@touchblack/icons';

import { useAuth } from '@presenters/auth/AuthContext';
import useGetTalentDetails from '@network/useGetTalentDetails';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useFocusEffect } from '@react-navigation/native';

const ProfileCard: React.FC = () => {
	const { styles, theme } = useStyles(stylesheet);
	const { userId, studioName } = useAuth();
	const { data: studioOwnerDetails, refetch } = useGetTalentDetails(userId!);

	const uploadPicture = () => {
		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.EditProfilePicture, data: { onSuccess: refetch } },
		});
	};
	useFocusEffect(
		useCallback(() => {
			refetch();
		}, []),
	);

	return (
		<Pressable onPress={() => {}} style={styles.cardContainer} accessibilityRole="button">
			<View style={styles.contentContainer}>
				<View style={styles.imageContainer}>
					<TouchableOpacity onPress={uploadPicture}>
						{studioOwnerDetails?.data?.profile_picture_url ? (
							<Avatar
								style={styles.image}
								source={{
									uri: createAbsoluteImageUri(studioOwnerDetails?.data?.profile_picture_url),
								}}
							/>
						) : (
							<Person size="113" color={theme.colors.muted} />
						)}
						<View style={styles.editIconContainer}>
							<Pencil size="24" color={theme.colors.primary} />
						</View>
					</TouchableOpacity>
				</View>
				<View style={styles.row}>
					<View style={styles.titleContainer}>
						<Text size="primaryMid" color="regular" numberOfLines={1} style={styles.titleText}>
							{`${studioOwnerDetails?.data?.first_name} ${studioOwnerDetails?.data?.last_name}`}
						</Text>
						<Text size="primarySm" color="regular" numberOfLines={1} style={styles.titleText}>
							{`${studioName}`}
						</Text>
						<Text size="bodyBig" color="regular" style={styles.subtitleText}>
							{studioOwnerDetails?.data?.mobile_number}
						</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	cardContainer: {
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
	},
	editIconContainer: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	imageContainer: {
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	contentContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundDarkBlack,
		marginHorizontal: theme.margins.base,
		flexDirection: 'row',
	},
	image: {
		width: 120,
		height: 120,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	imagePlaceholder: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		flex: 1,
	},
	titleContainer: {
		gap: theme.gap.xxxs,
	},
	titleText: {
		lineHeight: 32,
		opacity: 0.8,
	},
	subtitleText: {
		lineHeight: 24,
		opacity: 0.8,
	},
}));

export default ProfileCard;
