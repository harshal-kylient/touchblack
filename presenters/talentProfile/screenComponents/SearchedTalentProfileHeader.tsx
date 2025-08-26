import { ActivityIndicator, Keyboard, TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import BookmarkProfile from './BookmarkProfile';
import capitalized from '@utils/capitalized';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import iconmap from '@utils/iconmap';
import { Mail, Person, Verified } from '@touchblack/icons';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { clamp, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import CONSTANTS from '@constants/constants';
import { useEffect, useState } from 'react';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useAuth } from '@presenters/auth/AuthContext';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useFollowUser } from '@network/useFollowUser';
import { useQueryClient } from '@tanstack/react-query';
import useGetFollowingStatus from '@network/useGetFollowingStatus';

interface IProps {
	talentId: UniqueId;
}

function SearchedTalentProfileHeader({ talentId }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const viewWidth = CONSTANTS.screenWidth - 2 * theme.padding.base;
	const translateY = useSharedValue(0);
	const queryClient = useQueryClient();
	const initialHeight = useSharedValue(viewWidth);
	const isMinimized = useSharedValue(false);
	const postFollowUser = useFollowUser();
	const { permissions, loginType } = useAuth();
	const editAllowed = loginType === 'producer' ? permissions?.includes('Blackbook::Edit') : loginType !== 'manager';
	const { data: talentData } = useGetUserDetailsById('User', talentId);
	const { data: response } = useGetFollowingStatus(talentId);
	const isFollowing = response?.is_followed;
	const [isFollowingLocal, setIsFollowingLocal] = useState(isFollowing ?? false);
	const name = capitalized((talentData?.first_name || '') + ' ' + (talentData?.last_name || ''));

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
					queryClient.invalidateQueries(['useGetUserDetailsById', 'User', talentId]);
					queryClient.invalidateQueries(['useGetFollowingStatus', talentId]);
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
					user_id,user_name, user_type:"User"
				},
			},
		});
	};

	useEffect(() => {
		const kbshow = Keyboard.addListener('keyboardDidShow', () => {
			// Minimize
			translateY.value = withSpring(-viewWidth + 65);
			isMinimized.value = true;
		});

		return kbshow.remove;
	}, []);

	const PersonIcon = () => <Person color={theme.colors.muted} size={otherViewHeight} />;
	const Icon = iconmap(theme.colors.muted, otherViewHeight)[talentData?.talent_role?.toLowerCase()] || PersonIcon;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<PanGestureHandler onGestureEvent={panGestureHandler}>
				<Animated.View style={[styles.profileContainer, animatedStyle]}>
					<Animated.View style={[styles.marginContainer, animatedStyle]}>
						{talentData?.profile_picture_url ? <Animated.Image resizeMode="cover" style={[styles.backgroundImage, animatedStyle]} source={{ uri: createAbsoluteImageUri(talentData?.profile_picture_url) }} /> : <Icon size={otherViewHeight} />}
						<Animated.View style={[styles.contentContainer, animatedStyle2]}>
							<View style={styles.claimedContainer}>
								<Text color="regular" numberOfLines={1} style={styles.name} size="cardSubHeading">
									{talentData?.is_claimed ? 'Claimed' : 'Unclaimed'}
								</Text>
							</View>
							<View style={styles.aboutContainer}>
								<View style={styles.nameContainer}>
									<Text color="regular" numberOfLines={1} style={styles.name} size="primarySm">
										{name}
									</Text>

									{talentData?.verified && <Verified size="20" color={theme.colors.verifiedBlue} />}
								</View>
								<Text color="regular" numberOfLines={1} size="bodyMid">
									{capitalized(talentData?.talent_role)}
								</Text>
							</View>
							{loginType !== 'manager' && (
								<View style={styles.actionsContainer}>
									<TouchableOpacity
										style={styles.followButton}
										onPress={() => {
											if (isFollowing) {
												handleUnfollowUser(talentId, name);
											} else {
												handleFollowUser(talentId);
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

									<View style={styles.verticalDivider} />

									{editAllowed ? <BookmarkProfile talentData={talentData} /> : null}
									<View style={styles.verticalDivider} />
								</View>
							)}
						</Animated.View>
					</Animated.View>
				</Animated.View>
			</PanGestureHandler>
		</GestureHandlerRootView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	profileContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.typography,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
		maxWidth: UnistylesRuntime.screen.width,
		marginBottom: theme.padding.xxxxl,
	},
	claimedContainer:{
		backgroundColor: theme.colors.verifiedBlue,
		paddingVertical: theme.padding.xxxs * 2,
		paddingHorizontal: theme.padding.xs,
		alignSelf: 'flex-start',
	},
	nameContainer: {
		flexDirection: 'row',
	},
	name: {
		fontFamily: theme.fontFamily.cgBold,
		marginRight: theme.margins.xxxs,
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
		flex: 1,
		gap: 4,
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
	followButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.padding.sm * 1.30,
	},
	iconButton: {
		width: '14%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.black,
	},
	verticalDivider: {
		width: theme.borderWidth.slim,
		backgroundColor: theme.colors.borderGray,
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
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		maxHeight: '100%',
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		aspectRatio: 1 / 1,
		height: '100%',
	},
}));

export default SearchedTalentProfileHeader;