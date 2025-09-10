import React, { useEffect, useRef } from 'react';
import { Text } from '@touchblack/ui';
import { View, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { LongArrowRight } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';

const { width } = Dimensions.get('window');

function WhatsNew() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
    const { state, dispatch } = useFilterContext();
	// Animation values
	const slideAnim = useRef(new Animated.Value(-width)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const arrowSlideAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Staggered entrance animation
		Animated.sequence([
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.parallel([
				Animated.timing(fadeAnim, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.spring(scaleAnim, {
					toValue: 1,
					tension: 50,
					friction: 7,
					useNativeDriver: true,
				}),
			]),
		]).start();

		// Enhanced pulsing animation for the arrow
		const pulseAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.2,
					duration: 1000,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 1000,
					useNativeDriver: true,
				}),
			]),
		);

		// Enhanced arrow sliding animation with more visible movement
		const arrowSlideAnimation = Animated.loop(
			Animated.sequence([
				Animated.timing(arrowSlideAnim, {
					toValue: 10,
					duration: 1500,
					useNativeDriver: true,
				}),
				Animated.timing(arrowSlideAnim, {
					toValue: 0,
					duration: 1500,
					useNativeDriver: true,
				}),
			]),
		);

		pulseAnimation.start();
		arrowSlideAnimation.start();

		return () => {
			pulseAnimation.stop();
			arrowSlideAnimation.stop();
		};
	}, []);

	const handleWhatsNew = () => {
		dispatch({ type: 'TAB_CHANGE', value: 1 });
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.95,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start(() => {
			navigation.navigate('Search');
		});
	};

	return (
		<Animated.View
			style={[
				styles.subContainer,
				{
					transform: [{ translateX: slideAnim }],
				},
			]}>
			<Animated.View
				style={[
					styles.cardContainer,
					{
						opacity: fadeAnim,
						transform: [{ scale: scaleAnim }],
					},
				]}>
				{/* Gradient overlay effect */}
				<View style={styles.gradientOverlay} />

				<View style={styles.contentWrapper}>
					<Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
						<Text color="regular" size="bodyMid" style={styles.bannerText}>
							<Text style={styles.highlightText}>See what's new!</Text>{'\n'}
							Discover all the films we've just added to our collection.
						</Text>
					</Animated.View>

					<TouchableOpacity style={styles.bannerButtonContainer} onPress={handleWhatsNew} activeOpacity={0.8}>
						<View style={styles.buttonContent}>
							<View style={styles.subscribeNow}>
								<Text style={styles.subscribeNowText} size="bodyMid">
									What's new
								</Text>
								<View style={styles.textUnderline} />
							</View>

							<Animated.View
								style={[
									styles.arrowContainer,
									{
										transform: [{ scale: pulseAnim }, { translateX: arrowSlideAnim }],
									},
								]}>
								<LongArrowRight onPress={handleWhatsNew} color={theme.colors.black} size={width / 15} />
							</Animated.View>
						</View>

						{/* Shimmer effect */}
						<View style={styles.shimmerContainer}>
							<Animated.View style={styles.shimmerEffect} />
						</View>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</Animated.View>
	);
}

export default WhatsNew;

const stylesheet = createStyleSheet(theme => ({
	subContainer: {
		flex: 1,
		marginTop: theme.margins.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		overflow: 'hidden',
	},
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		position: 'relative',
		overflow: 'hidden',
	},
	gradientOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 0.5,
		backgroundColor: theme.colors.primary,
		opacity: 0.6,
	},
	contentWrapper: {
		position: 'relative',
		zIndex: 1,
	},
	textContainer: {
		paddingHorizontal: theme.margins.xxs,
		paddingVertical: theme.margins.xxxs,
	},
	bannerText: {
		marginHorizontal: theme.margins.xs,
		marginVertical: theme.margins.xs,
		lineHeight: 20,
		fontWeight: '400',
	},
	highlightText: {
		fontWeight: '600',
		color: theme.colors.primary,
	},
	bannerButtonContainer: {
		position: 'relative',
		overflow: 'hidden',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRadius: 0,
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	buttonContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		position: 'relative',
		zIndex: 2,
	},
	subscribeNow: {
		backgroundColor: 'transparent',
		fontSize: theme.fontSize.typographySm,
		paddingVertical: theme.padding.xs,
		position: 'relative',
	},
	subscribeNowText: {
		color: theme.colors.primary,
		paddingHorizontal: theme.padding.sm,
		fontWeight: '600',
		letterSpacing: 0.5,
	},
	textUnderline: {
		position: 'absolute',
		bottom: theme.padding.xs / 2,
		left: theme.padding.sm,
		right: theme.padding.sm,
		height: 1,
		backgroundColor: theme.colors.primary,
		opacity: 0.4,
	},
	arrowContainer: {
		backgroundColor: theme.colors.primary,
		padding: theme.padding.xs,
		borderRadius: 2,
		shadowColor: theme.colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	shimmerContainer: {
		position: 'absolute',
		top: 0,
		left: -100,
		right: 0,
		bottom: 0,
		overflow: 'hidden',
	},
	shimmerEffect: {
		width: 100,
		height: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		transform: [{ skewX: '-45deg' }],
	},
}));
