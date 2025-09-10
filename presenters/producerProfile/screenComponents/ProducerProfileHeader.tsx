import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { Pencil, Person } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { useAuth } from '@presenters/auth/AuthContext';
import { SheetType } from 'sheets';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import useGetFollowingStats from '@network/useGetFollowingStats';

interface IProducerProfileHeaderProps {
	producerId: string;
	onSuccess: () => void;
}

function ProducerProfileHeader({ producerId }: IProducerProfileHeaderProps) {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { producerId: producerIdInAuth, userId, businessOwnerId } = useAuth();
	const myProfile = producerId === producerIdInAuth;
	const queryClient = useQueryClient();
	const { data: producerData } = useGetUserDetailsById('Producer', producerId);
	const { data: response } = useGetFollowingStats(producerId);
	const following_count = response?.data?.following_count ?? 0;
	const followers_count = response?.data?.followers_count ?? 0;

	const uploadPicture = () => {
		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.EditProfilePicture, data: { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['useGetUserDetailsById', 'Producer', producerId] }) } },
		});
	};

	return (
		<View style={styles.profileContainer}>
			<View style={styles.marginContainer}>
				<View style={styles.imageContainer}>
					<Pressable disabled={myProfile ? userId !== businessOwnerId : true} onPress={uploadPicture}>
						{producerData?.profile_pic_url ? <Image style={styles.imgStyl} source={{ uri: createAbsoluteImageUri(producerData?.profile_pic_url) }} alt="" /> : <Person size="113" color={theme.colors.muted} />}
						{userId === businessOwnerId && (
							<View style={styles.editContainer(myProfile)}>
								<Pencil color={theme.colors.primary} size="24" />
							</View>
						)}
					</Pressable>
				</View>
				<View style={styles.contentContainer}>
					<View style={styles.switchContainer}>
						<Text color="regular" style={{ minWidth: '80%', maxWidth: '80%' }} size="primaryMid" numberOfLines={1} weight="regular">
							{producerData?.name}
						</Text>
					</View>
					<Text color="regular" style={{ minWidth: '84%', maxWidth: '84%' }} numberOfLines={1} size="primarySm" weight="regular">
						{capitalized(producerData?.owner_name || producerData?.producer_type.replaceAll('_', ' '))}
					</Text>
					<View style={styles.followingButtonContainer}>
						<TouchableOpacity
							style={styles.followerButton}
							onPress={() => {
								navigation.navigate('Following', { userId: producerId, header: 'Followers' });
							}}>
							<Text style={styles.talentRole} numberOfLines={1} color="primary" size="bodyMid" weight="regular">
								Followers({followers_count})
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.followingButton}
							onPress={() => {
								navigation.navigate('Following', { userId: producerId, header: 'Following' });
							}}>
							<Text style={styles.talentRole} numberOfLines={1} color="primary" size="bodyMid" weight="regular">
								Following({following_count})
							</Text>
						</TouchableOpacity>
					</View>
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
		marginBottom: theme.margins.xl,
	},
	followingButtonContainer: {
		flexDirection: 'row',
		
	},
	followerButton: {
		marginRight: theme.margins.xxxl,
		alignItems: 'center',
		paddingVertical: 5,
		marginTop: theme.margins.xxs,
	},
	followingButton: {
		alignItems: 'center',
		paddingVertical: 5,
		marginTop: theme.margins.xxs,
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
	editContainer: (myprofile: boolean) => ({
		display: myprofile ? 'flex' : 'none',
		position: 'absolute',
		backgroundColor: theme.colors.backgroundDarkBlack,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		right: 0,
		bottom: 0,
		borderLeftWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	contentContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: 25,
	},
	icon: {
		padding: theme.padding.xxs,
		backgroundColor: 'transparent',
	},
	producerName: {
		opacity: 0.8,
	},
	producerRole: {
		opacity: 0.8,
	},
	switchContainer: {
		flexDirection: 'row',
	},
	imgStyl: {
		aspectRatio: 1 / 1,
		height: '100%',
		position: 'relative',
	},
	talentRole: {},
}));

export default ProducerProfileHeader;
