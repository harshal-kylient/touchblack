import { ActivityIndicator, TouchableOpacity, View, Image } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import MessageProfile from './MessageProfile';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import iconmap from '@utils/iconmap';
import { Mail, Person } from '@touchblack/icons';
import CONSTANTS from '@constants/constants';
import { useEffect, useState } from 'react';
import IProducerSearch from '@models/dtos/IProducerSearch';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';
import { useFollowUser } from '@network/useFollowUser';
import { useQueryClient } from '@tanstack/react-query';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import useGetFollowingStatus from '@network/useGetFollowingStatus';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, interpolate, runOnJS, withSequence, withTiming, Easing } from 'react-native-reanimated';

interface ISearchedProducerProfileHeaderProps {
	producerId: UniqueId;
}

const SearchedProducerProfileHeader: React.FC<ISearchedProducerProfileHeaderProps> = ({ producerId }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const { data: producerData } = useGetUserDetailsById('Producer', producerId);
	const { data: response } = useGetFollowingStatus(producerId);
	const isFollowing = response?.is_followed;
	const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing ?? false);
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const postFollowUser = useFollowUser();

	// Animation values
	const containerOpacity = useSharedValue(0);
	const containerScale = useSharedValue(0.9);
	const imageScale = useSharedValue(0);
	const infoTranslateX = useSharedValue(50);
	const buttonsTranslateY = useSharedValue(30);
	const buttonsOpacity = useSharedValue(0);
	const followButtonScale = useSharedValue(1);
	const shimmerTranslateX = useSharedValue(-100);
	const messageButtonScale = useSharedValue(1);

	// Shimmer animation
	useEffect(() => {
		const startShimmer = () => {
			shimmerTranslateX.value = withDelay(2000, withSequence(withTiming(UnistylesRuntime.screen.width + 100, { duration: 1500, easing: Easing.out(Easing.cubic) }), withTiming(-100, { duration: 0 }), withDelay(3000, withTiming(UnistylesRuntime.screen.width + 100, { duration: 1500, easing: Easing.out(Easing.cubic) }))));
		};
		startShimmer();
	}, []);

	// Entrance animations
	useEffect(() => {
		const animateEntrance = () => {
			containerOpacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
			containerScale.value = withSpring(1, { damping: 12, stiffness: 100 });

			imageScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 120 }));

			infoTranslateX.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 100 }));

			buttonsTranslateY.value = withDelay(600, withSpring(0, { damping: 12, stiffness: 100 }));
			buttonsOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
		};

		if (producerData) {
			animateEntrance();
		}
	}, [producerData]);

	// Button press animations
	const animateFollowButton = () => {
		followButtonScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1, { damping: 8, stiffness: 150 }));
	};

	const animateMessageButton = () => {
		messageButtonScale.value = withSequence(withTiming(0.95, { duration: 100 }), withSpring(1, { damping: 8, stiffness: 150 }));
	};

	function navigateToConversation() {
		animateMessageButton();
		navigation.navigate('Conversation', {
			receiver_id: producerId,
			receiver_type: 'Producer',
			name: producerData?.name,
			picture: createAbsoluteImageUri(producerData?.profile_pic_url),
		});
	}

	const handleFollowUser = (user_id: string) => {
		animateFollowButton();
		postFollowUser.mutate(
			{ user_id },
			{
				onSuccess: () => {
					setIsFollowingLocal(true);
					queryClient.invalidateQueries(['useGetUserDetailsById', 'Producer', producerId]);
					queryClient.invalidateQueries(['useGetFollowingStatus', producerId]);
				},
				onError: (error: any) => {
					console.error('Follow user failed:', error);
				},
			},
		);
	};

	useEffect(() => {
		if (typeof isFollowing === 'boolean') {
			setIsFollowingLocal(isFollowing);
		}
	}, [isFollowing]);

	const handleUnfollowUser = async (user_id: string, user_name: string) => {
		animateFollowButton();
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.UnFollowUserSheet,
				data: {
					user_id,
					user_name,
					user_type: 'Producer',
				},
			},
		});
	};

	// Animated styles
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: containerOpacity.value,
		transform: [{ scale: containerScale.value }],
	}));

	const imageAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: imageScale.value }],
	}));

	const infoAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: infoTranslateX.value }],
		opacity: interpolate(infoTranslateX.value, [50, 0], [0, 1]),
	}));

	const buttonsAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: buttonsTranslateY.value }],
		opacity: buttonsOpacity.value,
	}));

	const followButtonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: followButtonScale.value }],
	}));

	const messageButtonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: messageButtonScale.value }],
	}));

	const shimmerAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: shimmerTranslateX.value }],
	}));

	return (
		<Animated.View style={[styles.profileContainer, containerAnimatedStyle]}>
			<View style={styles.marginContainer}>
				{/* Top row: Image left, Name/Profession right */}
				<View style={styles.topRowContainer}>
					<Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
						{producerData?.profile_pic_url ? (
							<Image resizeMode="cover" style={styles.profileImage} source={{ uri: createAbsoluteImageUri(producerData?.profile_pic_url) }} />
						) : (
							<View style={styles.iconContainer}>
								<Person color={theme.colors.muted} size="32" />
							</View>
						)}
					</Animated.View>
					<Animated.View style={[styles.infoContainer, infoAnimatedStyle]}>
						<Text color="regular" numberOfLines={2} size="primaryMid">
							{capitalized(producerData?.name)}
						</Text>
						<Text color="muted" numberOfLines={2} size="cardHeading" weight="medium" style={styles.professionText}>
							{capitalized(producerData?.producer_type?.replaceAll('_', ' '))}
						</Text>
					</Animated.View>
				</View>

				{/* Bottom row: Action buttons */}
				{loginType !== 'manager' && (
					<Animated.View style={[styles.actionsContainer, buttonsAnimatedStyle]}>
						<Animated.View style={[styles.buttonWrapper, followButtonAnimatedStyle]}>
							<TouchableOpacity
								style={[styles.followButton, isFollowingLocal && styles.followingButton]}
								onPress={() => {
									if (isFollowing) {
										handleUnfollowUser(producerId, producerData?.name);
									} else {
										handleFollowUser(producerId);
									}
								}}>
								{postFollowUser.isPending ? (
									<View style={{ paddingVertical: theme.padding.sm }}>
										<ActivityIndicator color={isFollowingLocal ? theme.colors.primary : theme.colors.black} size="small" />
									</View>
								) : (
									<Text color={isFollowingLocal ? 'primary' : 'black'} numberOfLines={1} style={styles.followText} size="button">
										{isFollowingLocal ? 'Unfollow' : 'Follow'}
									</Text>
								)}
								<Animated.View style={[styles.buttonShimmer, shimmerAnimatedStyle]} />
							</TouchableOpacity>
						</Animated.View>

						{loginType !== 'producer' ? (
							<TouchableOpacity onPress={navigateToConversation} style={styles.messageButton}>
								<Mail color={theme.colors.primary} size="30" />
							</TouchableOpacity>
						) : 
						null}
					</Animated.View>
				)}
			</View>
		</Animated.View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	profileContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
		maxWidth: UnistylesRuntime.screen.width,
		marginBottom: theme.padding.base,
		backgroundColor: theme.colors.black,
		shadowColor: theme.colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	marginContainer: {
		marginHorizontal: theme.margins.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: 'rgba(255, 255, 255, 0.02)',
	},
	topRowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	imageContainer: {
		marginRight: theme.margins.lg,
		position: 'relative',
	},
	profileImage: {
		width: 125,
		height: 125,
	},
	iconContainer: {
		width: 125,
		height: 125,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	infoContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	professionText: {
		marginTop: theme.margins.xxs,
		opacity: 0.8,
	},
	actionsContainer: {
		flexDirection: 'row',
		gap: theme.margins.base,
		borderTopWidth: theme.borderWidth.slim,
		paddingVertical: theme.padding.base,
		borderColor: theme.colors.borderGray,
	},
	buttonWrapper: {
		flex: 1,
	},
	followButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		position: 'relative',
		overflow: 'hidden',
		shadowColor: theme.colors.primary,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	followingButton: {
		backgroundColor: theme.colors.black,
		borderWidth: 1,
		borderColor: theme.colors.primary,
		shadowOpacity: 0.1,
	},
	followText: {
		fontFamily: theme.fontFamily.cgMedium,
		letterSpacing: 0.5,
		paddingVertical: theme.padding.sm,
	},
	messageButton: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: '100%',
		width:60,
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		
	},
	messageIconContainer: {
		width: 30,
		height: 30,
		
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: theme.margins.xs,
	},
	messageText: {
		letterSpacing: 0.3,
	},
	buttonShimmer: {
		position: 'absolute',
		top: 0,
		left: -100,
		width: 50,
		height: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		transform: [{ skewX: '-20deg' }],
	},
}));

export default SearchedProducerProfileHeader;
