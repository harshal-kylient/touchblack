import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Close, Dangerous, ErrorFilled, LongArrowRight } from '@touchblack/icons';
import { useAuth } from '@presenters/auth/AuthContext';
import { Text } from '@touchblack/ui';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import CONSTANTS from '@constants/constants';

const { width } = Dimensions.get('window');

type RootStackParamList = {
	UserDetails: undefined;
};

type SubscriptionPopupNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

interface IProps {
	data: any;
	subscriptionStatus: string;
	subscriptionId: string;
}

export default function SubscriptionBanner({ data, subscriptionStatus, subscriptionId }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const subscriptionID = subscriptionId;
	const [isVisible, setIsVisible] = useState(true);
	const navigation = useNavigation<SubscriptionPopupNavigationProp>();
	const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	const subscriptionPlanId = subscriptionPlans?.data?.subscription_plans?.length ? subscriptionPlans.data.subscription_plans[0].id : null;

	const handleCloseBanner = () => {
		setIsVisible(false);
	};
	const getDaysLeft = (endDate: string) => {
		const now = moment();
		const end = moment(endDate);
		const daysLeft = end.diff(now, 'days');
		return daysLeft > 0 ? daysLeft : 0;
	};
	const getBannerContent = () => {
		const trialdaysLeft = getDaysLeft(data?.data?.subscription?.end_time);
		const gracePeriodDaysLeft = getDaysLeft(data?.data?.subscription?.current_billing_cycle?.grace_period_end_time);
		if (subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ACTIVE) {
			if (trialdaysLeft > 3) {
				return {
					title: `Premium trial activated.`,
					body: `Your Talent Grid Premium trial has begun. You have ${trialdaysLeft} days to explore and sign up. Make it count.`,
				};
			} else if (trialdaysLeft > 1) {
				return {
					title: `${trialdaysLeft} days to go!`,
					body: `Your free trial ends in ${trialdaysLeft} days. Sign up to keep the projects coming.`,
				};
			} else {
				return {
					title: `Trial ends today!`,
					body: `Your free trial ends in less than 24 hours. Subscribe now to keep your access uninterrupted.`,
				};
			}
		}

		if (subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ENDED) {
			return {
				title: 'Premium trial period ended.',
				body: 'Your Talent Grid premium trial has expired. No problem. Click here and we will have it back on in no time.',
			};
		}

		if (subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE) {
			if (gracePeriodDaysLeft > 2) {
				return {
					title: 'Subscription expired.',
					body: `Since we love you so much, we have added a few days to the subscription. Like all good things - it ends in ${gracePeriodDaysLeft} days.`,
				};
			} else {
				return {
					title: 'Friendly reminder.',
					body: `Your subscription ended but since we love you so much, we have added a few days only for you. Like all good things - it ends in  ${gracePeriodDaysLeft} days.`,
				};
			}
		}

		if (subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED) {
			return {
				title: 'Subscription expired.',
				body: 'We are sad to see you go. However, you can renew your subscription in three easy steps from your settings.',
			};
		}

		return { title: '', body: '' };
	};

	const { title, body } = getBannerContent();

	const handleSubscribe = useCallback(() => {
		if (!subscriptionPlanId) {
			return;
		}
		navigation.navigate('StandardSubscription', { planId: subscriptionPlanId, subscriptionPlan: subscriptionPlans });
	}, [navigation, subscriptionPlanId]);

	const handlePaynow = useCallback(() => {
		if (!subscriptionPlanId) {
			return;
		}
		navigation.navigate('StandardSubscription', { planId: subscriptionPlanId, subscriptionPlan: subscriptionPlans, subscriptionId: subscriptionID });
	}, [navigation, subscriptionPlanId, subscriptionID]);

	return (
		isVisible && (
			<View style={styles.subContainer}>
				<View style={styles.cardContainer}>
					<View style={styles.StandardText}>
						<View style={styles.bannerTextRow}>
							<ErrorFilled color={theme.colors.destructive} size={width / 20} />
							<Text size="bodyBig" color="regular" weight="semibold" style={styles.bannerTextInfo} numberOfLines={1} ellipsizeMode="tail">
								{title}
							</Text>
							<View style={styles.flexSpacer} />

							<TouchableOpacity onPress={handleCloseBanner} style={styles.closeIconContainer}>
								<Dangerous size={25} color={theme.colors.destructive} />
							</TouchableOpacity>
						</View>

						<Text color="regular" size="bodySm">
							{body}
						</Text>
					</View>
					<View style={styles.bannerButtonContainer}>
						{['trial_active', 'trial_ended'].includes(subscriptionStatus) ? (
							<>
								<TouchableOpacity onPress={handleSubscribe} style={styles.subscribeNow}>
									<Text style={styles.subscribeNowText} size="bodyMid">
										Subscribe Now
									</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={handleSubscribe} style={styles.arrowContainer}>
									<LongArrowRight color={theme.colors.black} size={width / 15} />
								</TouchableOpacity>
							</>
						) : ['grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) ? (
							<>
								<TouchableOpacity onPress={handlePaynow} style={styles.subscribeNow}>
									<Text style={styles.subscribeNowText} size="bodyMid">
										Pay Now
									</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={handlePaynow} style={styles.arrowContainer}>
									<LongArrowRight color={theme.colors.black} size={width / 15} />
								</TouchableOpacity>
							</>
						) : null}
					</View>
				</View>
			</View>
		)
	);
}

const stylesheet = createStyleSheet(theme => ({
	cardContainer: {
		marginHorizontal: theme.margins.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	flexSpacer: {
		flex: 1,
	},
	closeIconContainer: {
		marginRight: -theme.margins.xxs,
		paddingLeft: theme.padding.base,
		paddingBottom: theme.padding.xs,
	},
	StandardText: {
		margin: theme.margins.base,
		gap: theme.gap.xs,
	},
	subContainer: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
		marginVertical: theme.margins.sm,
	},
	bannerTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	bannerTextInfo: {
		marginLeft: theme.margins.sm,
	},
	bannerButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	subscribeNow: {
		backgroundColor: theme.colors.backgroundLightBlack,
		fontSize: theme.fontSize.typographySm,
		paddingVertical: theme.padding.sm,
	},
	subscribeNowText: {
		color: theme.colors.primary,
		paddingHorizontal: theme.padding.base,
	},
	arrowContainer: {
		backgroundColor: theme.colors.primary,
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.xxs,
	},
}));
