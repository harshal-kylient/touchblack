import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, View, Pressable, Linking, ActivityIndicator, Text as RNtext } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Text, Button } from '@touchblack/ui';
import { ArrowRight } from '@touchblack/icons';
import { SheetManager } from 'react-native-actions-sheet';
import Header from '@components/Header';
import { useGetSubscriptionCurrentStatus } from '@network/useGetSubscriptionCurrentStatus';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import { useSetAutoPayStatus } from '@network/useSetAutoPayStatus';
import { useQueryClient } from '@tanstack/react-query';
import Switch from '@components/Switch';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import CONSTANTS from '@constants/constants';
import { getReporterId } from '@utils/reporterId';

type RootStackParamList = {
	CancelSubscription: undefined;
	BillingHistory: undefined;
};

type CancelSubscriptionNavigationProp = NavigationProp<RootStackParamList, 'CancelSubscription'>;

const Subscriptions: React.FC = () => {
	const { styles, theme } = useStyles(stylesheet);
	const queryClient = useQueryClient();
	const navigation = useNavigation<CancelSubscriptionNavigationProp>();
	const [autoPayLoading, setAutoPayLoading] = useState(false);
	const { userId, producerId, loginType, authToken } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const reporterId = getReporterId(loginType, producerId, userId);
	const { data: talentData } = useGetUserDetailsById(userType, reporterId);
	// const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	// const subscriptionPlan = subscriptionPlans?.data?.subscription_plans[0];
	// const { data: subsCurrentStatus, refetch } = useGetSubscriptionCurrentStatus();
	// const date = subsCurrentStatus?.data?.subscription?.current_billing_cycle;
	// const subscriptionStatus = subsCurrentStatus?.data?.subscription_status?.collated_status;
	// const autoPayStatus = subsCurrentStatus?.data?.subscription?.auto_pay_status || 'disabled';
	// const subscriptionId = subsCurrentStatus?.data?.subscription?.id;
	const { mutate: setAutoPayStatus } = useSetAutoPayStatus();
	const formatDate = (isoString: string | number | Date) => {
		const date = new Date(isoString);
		return date.toLocaleDateString('en-GB');
	};
	// useFocusEffect(
	// 	useCallback(() => {
	// 		refetch();
	// 	}, []),
	// );

	// const handleAutoPayToggle = (value: boolean) => {
	// 	const status = value ? 'enabled' : 'disabled';
	// 	setAutoPayLoading(true);
	// 	if (subscriptionId) {
	// 		setAutoPayStatus(
	// 			{ subscriptionId, status },
	// 			{
	// 				onSuccess: data => {
	// 					queryClient.invalidateQueries({ queryKey: ['subscriptionCurrentStatus'] });
	// 					if (status === 'enabled') {
	// 						const session_id = data?.data?.provider_data?.subscription_session_id;
	// 						handleSubscriptionRedirect(session_id);
	// 					}
	// 				},
	// 				onError: () => {
	// 					setAutoPayStatus(prev => !prev);
	// 				},
	// 				onSettled: () => {
	// 					setAutoPayLoading(false);
	// 				},
	// 			},
	// 		);
	// 	}
	// };
	// const handleSubscriptionRedirect = async (session_id: string) => {
	// 	setAutoPayLoading(false);
	// 	let url = `${CONSTANTS.WEB_URL}/subscriptionPayment?session_id=${session_id}&token=${authToken}`;
	// 	try {
	// 		await Linking.openURL(url);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	// const handleCancelSubscription = () => {
	// 	SheetManager.hide('Drawer');
	// 	navigation.navigate('CancelSubscription', { subscription_id: subscriptionId, date: date?.end_time });
	// };
	// const handleSubscribe = useCallback(() => {
	// 	if (!subscriptionPlan?.id) {
	// 		return;
	// 	}
	// 	SheetManager.hide('Drawer');
	// 	navigation.navigate('StandardSubscription', { planId: subscriptionPlan.id, subscriptionPlan: subscriptionPlans });
	// }, [navigation, subscriptionPlan]);

	// const handleBillingHistory = () => {
	// 	navigation.navigate('BillingHistory', { currentSubs: subsCurrentStatus });
	// };

	// const handleRestartSubscription = useCallback(() => {
	// 	if (!subscriptionPlan?.id) {
	// 		return;
	// 	}
	// 	SheetManager.hide('Drawer');
	// 	navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans, subscriptionId: subscriptionId });
	// }, [navigation, subscriptionPlan, subscriptionId]);

	// const handleStandard = () => {
	// 	navigation.navigate('StandardSubscription');
	// };
	// const renderSubscriptionButton = () => {
	// 	if ([CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ACTIVE, CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ENDED].includes(subscriptionStatus)) {
	// 		return (
	// 			<Button onPress={handleSubscribe} style={styles.cancelSub} type="primary" textColor="primary">
	// 				Subscribe Now
	// 			</Button>
	// 		);
	// 	}

	// 	if ([CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE, CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED].includes(subscriptionStatus)) {
	// 		return (
	// 			<Button onPress={handleSubscribe} style={styles.cancelSub} textColor="primary">
	// 				Restart Subscription
	// 			</Button>
	// 		);
	// 	}

	// 	if ([CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE, CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED].includes(subscriptionStatus)) {
	// 		return (
	// 			<Button onPress={handleRestartSubscription} style={styles.cancelSub} textColor="primary">
	// 				Pay Now
	// 			</Button>
	// 		);
	// 	}
	// 	if ([CONSTANTS.SUBSCRIPTION_TYPES.REGULAR_ACTIVE].includes(subscriptionStatus)) {
	// 		return (
	// 			<Button onPress={handleCancelSubscription} style={styles.cancelSub} textColor="primary">
	// 				Cancel subscription
	// 			</Button>
	// 		);
	// 	}

	// 	return null;
	// };

	// const getSubscriptionMessage = () => {
	// 	switch (subscriptionStatus) {
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.REGULAR_ACTIVE:
	// 			return formatDate(date?.end_time);
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ACTIVE:
	// 			return formatDate(subsCurrentStatus?.data?.subscription?.end_time);
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE:
	// 			return formatDate(date?.end_time);
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED:
	// 			return 'Subscription Ended';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE:
	// 			return formatDate(date?.grace_period_end_time);
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED:
	// 			return 'Grace Period Ended';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ENDED:
	// 			return 'Trail Period Ended';
	// 		default:
	// 			return '';
	// 	}
	// };

	// const getSubscriptionLabel = () => {
	// 	switch (subscriptionStatus) {
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.REGULAR_ACTIVE:
	// 			return 'Next Billing Date';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ACTIVE:
	// 			return 'Trail Period Ends On';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE:
	// 			return 'Subscription Ends On';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED:
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED:
	// 			return 'Subscription Ended';
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE:
	// 			return 'Grace period Ends On';
	// 		default:
	// 			return '';
	// 	}
	// };

	return (
		<SafeAreaView style={styles.container}>
			{autoPayLoading ? (
				<SafeAreaView style={styles.loaderContainer}>
					<ActivityIndicator color={theme.colors.primary} />
				</SafeAreaView>
			) : null}
			<Header name="Subscription" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text size="secondary" color="regular" style={styles.subtitleText}>
					User Information
				</Text>

				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<Text size="bodyBig" color="regular" style={styles.textContainer}>
							Email Id : {talentData?.email}
						</Text>
					</View>
				</View>

				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<Text size="bodyBig" color="regular" style={styles.textContainer}>
							Mob No : {talentData?.mobile_number}
						</Text>
					</View>
				</View>

				<Text size="secondary" color="regular" style={styles.subtitleText}>
					Plan Details
				</Text>

				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.StandardContainerOne}>
							<Text size="bodyBig" color="regular" style={styles.TopText}>
								Introductory Offer
								{/* {getSubscriptionMessage()} */}
							</Text>
							<Text color="muted" size="bodyMid">
								Enjoy the benefits of Talent Grid premium at no charge
								{/* {getSubscriptionLabel()} */}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.standardText}>
					<View style={styles.subContainer}>
						<View style={styles.cardContainer}>
							<View style={styles.StandardText}>
								<View style={styles.columnContainer}>
									<View style={styles.StandardContainer}>
										<Text
											size="primaryMid"
											color="regular"
											// onPress={handleStandard}
											style={styles.TopText}>
											{/* {['regular_active', 'cancelled_active', 'grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) ? subsCurrentStatus?.data.subscription?.subscription_plan?.name : 'No Active Subscription'} */}
											Premium plan
										</Text>
										{/* <Text color="muted" size="bodyMid">
											Plan
										</Text> */}
									</View>
								</View>
								<View style={styles.StandardContainer}>
									{/* <Text size="primaryMid" color="regular" style={styles.priceText}> */}
									<RNtext style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 22 }}>₹349 </RNtext> <RNtext style={{ fontWeight: 'bold', color: '#ffffff', fontSize: 22 }}>₹0</RNtext>
									<RNtext style={{ fontWeight: '400', color: theme.colors.muted, alignSelf: 'flex-end' }}>/ per month</RNtext>
									{/* {['regular_active', 'cancelled_active', 'grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) ? `₹ ${subsCurrentStatus?.data.subscription?.subscription_plan?.price_after_taxes}/month` : ''} */}
									{/* </Text> */}
								</View>
							</View>
						</View>
					</View>
				</View>
				{/* <View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<Pressable style={styles.card} 
						// onPress={handleBillingHistory}
						>
							<Text size="bodyBig" color="regular">
								Billing History
							</Text>
							<ArrowRight color="white" size={20} />
						</Pressable>
					</View>
				</View> */}
			</ScrollView>
			{/* {renderSubscriptionButton()} */}
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	scrollContainer: {
		width: '100%',
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: theme.padding.base,
		justifyContent: 'space-between',
	},
	loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	TopText: {
		marginBottom: theme.margins.xxs,
	},
	subContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	AutoContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	switchContainer: {
		transform: [{ scale: 0.7 }],
		borderColor: '#FFFFFF',
		borderWidth: theme.borderWidth.bold,
		borderRadius: 20,
		width: 'auto',
		margin: theme.margins.base,
	},
	StandardText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	columnContainer: {
		flexDirection: 'column',
	},
	otherSections: {
		marginTop: theme.margins.base,
	},
	priceText: {
		textAlign: 'center',
		marginLeft: theme.margins.base,
	},
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	textContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.sm,
	},
	StandardContainer: {
		marginHorizontal: theme.margins.base,
		marginVertical: theme.margins.sm,
		flexDirection: 'row',
	},
	StandardContainerOne: {
		marginHorizontal: theme.margins.base,
		marginVertical: theme.margins.sm,
	},
	standardText: {},
	cancelSub: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		borderColor: theme.colors.primary,
		borderWidth: 1,
		marginBottom: theme.margins.base * 2,
	},
	subtitleText: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xxxl,
		marginBottom: theme.margins.base,
	},
}));

export default Subscriptions;
