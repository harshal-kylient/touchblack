import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import MessageProfile from './MessageProfile';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import iconmap from '@utils/iconmap';
import { Mail, Person } from '@touchblack/icons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { clamp, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
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
	const viewWidth = CONSTANTS.screenWidth - 2 * theme.padding.base;
	const translateY = useSharedValue(0);
	const initialHeight = useSharedValue(viewWidth);
	const isMinimized = useSharedValue(false);
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const postFollowUser = useFollowUser();
	
	const panGestureHandler = useAnimatedGestureHandler({
		onStart: (_, ctx) => {
			ctx.startY = translateY.value;
		},
		onActive: (event, ctx) => {
			translateY.value = clamp(event.translationY + ctx.startY, -viewWidth + 60, 0);
		},
		onEnd: () => {
			if (translateY.value <= (-viewWidth + 60) / 2 && !isMinimized.value) {
				// Minimize
				translateY.value = withSpring(-viewWidth + 60);
				isMinimized.value = true;
			} else if (translateY.value >= (-viewWidth + 60) / 2 && isMinimized.value) {
				// Maximize
				translateY.value = withSpring(0);
				isMinimized.value = false;
			} else {
				// Spring back
				translateY.value = isMinimized.value ? withSpring(-viewWidth + 60) : withSpring(0);
			}
		},
	});

	function navigateToConversation() {
		navigation.navigate('Conversation', {
			receiver_id: producerId,
			receiver_type: 'Producer',
			name: producerData?.name,
			picture: createAbsoluteImageUri(producerData?.profile_pic_url),
		});
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: initialHeight.value + translateY.value,
		};
	});

	const [otherViewHeight, setOtherViewHeight] = useState(initialHeight.value);
	useDerivedValue(() => {
		const calculatedHeight = initialHeight.value + translateY.value;
		runOnJS(setOtherViewHeight)(calculatedHeight);
	});

	const animatedStyle2 = useAnimatedStyle(() => {
		return {
			width: isMinimized.value ? CONSTANTS.screenWidth - 2 * theme.padding.base - 60 : '100%',
			right: 0,
		};
	});
	const handleFollowUser = (user_id: string) => {
		postFollowUser.mutate(
			{ user_id },
			{
				onSuccess: () => {
					setIsFollowingLocal(true);
					queryClient.invalidateQueries(['useGetUserDetailsById', 'Producer', producerId]);
					queryClient.invalidateQueries(['useGetFollowingStatus', producerId]);
					;
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
	
	const handleUnfollowUser = async (user_id:string, user_name:string) => {
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

	const PersonIcon = () => <Person color={theme.colors.muted} size={otherViewHeight} />;
	const Icon = iconmap(theme.colors.muted, otherViewHeight)[producerData?.producer_type?.toLowerCase()] || PersonIcon;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PanGestureHandler onGestureEvent={panGestureHandler}>
				<Animated.View style={[styles.profileContainer, animatedStyle]}>
					<Animated.View style={[styles.marginContainer, animatedStyle]}>
						{producerData?.profile_pic_url ? <Animated.Image resizeMode="cover" style={[styles.backgroundImage, animatedStyle]} source={{ uri: createAbsoluteImageUri(producerData?.profile_pic_url) }} /> : <Icon size={otherViewHeight} />}
						<Animated.View style={[styles.contentContainer, animatedStyle2]}>
							<View style={styles.aboutContainer}>
								<Text color="regular" numberOfLines={1} size="primarySm" weight="regular">
									{capitalized(producerData?.name)}
								</Text>
								<Text color="regular" numberOfLines={1} size="bodyMid" weight="regular">
									{capitalized(producerData?.producer_type?.replaceAll('_', ' '))}
								</Text>
							</View>
							{loginType !== 'manager' && (
								<View style={styles.actionsContainer}>
									<TouchableOpacity
										style={styles.followButton}
										onPress={() => {
											if (isFollowing) {
												handleUnfollowUser(producerId, producerData?.name);
											} else {
												handleFollowUser(producerId);
											}
										}}>
										<Text color="black" numberOfLines={1} style={styles.followText} size="button">
											{postFollowUser.isPending ? (
												<ActivityIndicator color={theme.colors.black} size="small" />
											) : (
												<Text color="black" numberOfLines={1} style={styles.followText} size="button">
													{isFollowingLocal ? 'Unfollow' : 'Follow'}
												</Text>
											)}
										</Text>
									</TouchableOpacity>

									{loginType !== 'producer' ? (
										<TouchableOpacity onPress={navigateToConversation} style={styles.iconContainer}>
											<Mail color={theme.colors.primary} size="24" />
										</TouchableOpacity>
									) : null}
								</View>
							)}
						</Animated.View>
					</Animated.View>
				</Animated.View>
			</PanGestureHandler>
		</GestureHandlerRootView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	profileContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.typography,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
		maxWidth: UnistylesRuntime.screen.width,
		marginBottom: theme.padding.xxxxl,
	},
	followButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.padding.sm * 1.30,
	},
	followText: {
		fontFamily: theme.fontFamily.cgMedium,
	},
	marginContainer: {
		width: 'auto',
		marginHorizontal: theme.margins.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	backgroundImage: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		aspectRatio: 1,
		justifyContent: 'center',
	},
	aboutContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		backgroundColor: 'rgba(0,0,0,.7)',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	actionsContainer: {
		flexDirection: 'row',
		width: '100%',
		flex: 1,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentContainer: {
		width: '100%',
		justifyContent: 'space-between',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		height: 'auto',
		position: 'absolute',
		marginBottom: 1,
		bottom: 0,
	},
	iconContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: '100%',
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		aspectRatio: 1 / 1,
		height: '100%',
	},
}));

export default SearchedProducerProfileHeader;
