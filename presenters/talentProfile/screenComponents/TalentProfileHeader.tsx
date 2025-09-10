import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

import { Pencil, Person, Verified } from '@touchblack/icons';
import { Avatar, Text } from '@touchblack/ui';

import { SheetType } from 'sheets';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import useGetFollowingStats from '@network/useGetFollowingStats';
import { useAuth } from '@presenters/auth/AuthContext';

function TalentProfileHeader({ talentId }: { talentId: UniqueId }) {
	const { styles, theme } = useStyles(stylesheet);
	const {loginType} = useAuth()
	const { data: talentData, refetch } = useGetUserDetailsById('User', talentId);
	const { data: response } = useGetFollowingStats(talentId);
	const following_count = response?.data?.following_count ?? 0;
	const followers_count = response?.data?.followers_count ?? 0;
	const navigation = useNavigation()
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
		<View style={styles.profileContainer}>
			<View style={styles.marginContainer}>
				<View style={styles.imageContainer}>
					<TouchableOpacity onPress={uploadPicture}>
						{talentData?.profile_picture_url ? (
							<Avatar
								style={styles.image}
								source={{
									uri: createAbsoluteImageUri(talentData?.profile_picture_url),
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
				<View style={styles.contentContainer}>
					<View style={styles.nameContainer}>
						<Text style={styles.talentName} numberOfLines={1} color="regular" size="primaryMid" weight="regular">
							{capitalized((talentData?.first_name || '') + ' ')}
						</Text>

						{/* {talentData?.verified && <Verified size="22" color={theme.colors.verifiedBlue} />} */}
					</View>
					<Text style={styles.talentRole} numberOfLines={1} color="regular" size="primarySm" weight="regular">
						{capitalized(talentData?.talent_role)}
					</Text>
					{loginType !== 'manager' && (
						<View style={styles.followingButtonContainer}>
							<TouchableOpacity
								style={styles.followerButton}
								onPress={() => {
									navigation.navigate('Following', { userId: talentId, header: 'Followers' });
								}}>
								<Text style={styles.talentRole} numberOfLines={1} color="primary" size="bodyMid" weight="regular">
									Followers({followers_count})
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.followingButton}
								onPress={() => {
									navigation.navigate('Following', { userId: talentId, header: 'Following' });
								}}>
								<Text style={styles.talentRole} numberOfLines={1} color="primary" size="bodyMid" weight="regular">
									Following({following_count})
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	profileContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		marginBottom: theme.margins.xxl,
	},
	followingButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	followerButton: {
		marginRight: theme.margins.xxxl,
		alignItems: 'center',
		paddingVertical: 5,
		marginTop: theme.margins.sm,
	},
	followingButton: {
		alignItems: 'center',
		paddingVertical: 5,
		marginTop: theme.margins.sm,
	},

	nameContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		
		marginBottom: theme.margins.xxxs,
	},
	marginContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		maxHeight: 113,
		alignItems: 'center',
	},
	image: {
		aspectRatio: 1 / 1,
		objectFit: 'cover',
		height: '100%',
		position: 'relative',
	},
	imageContainer: {
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
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
	contentContainer: {
		paddingHorizontal: theme.padding.base,
	},
	icon: {
		padding: theme.padding.xxs,
		backgroundColor: 'transparent',
	},
	talentName: {
		opacity: 0.8,
	},
	talentRole: {
		opacity: 0.8,
	},
}));

export default TalentProfileHeader;
