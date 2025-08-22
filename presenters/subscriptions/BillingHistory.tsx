import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Dimensions, FlatList, Linking } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text, Button } from '@touchblack/ui';
import Header from '@components/Header';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useGetBillingHistory } from '@network/useGetBillingHistory';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';

interface SubscriptionBillingCycle {
	id: string;
	subscription_id: string;
	grace_period_start_time: string;
	grace_period_end_time: string;
	start_time: string;
	end_time: string;
	status: string;
	created_at: string;
	updated_at: string;
	subscription_plan: {
		base_price: string;
		price_after_taxes: string;
	};
}

const BillingHistory: React.FC = ({ route }) => {
	const activeSubscription = route?.params?.currentSubs;
	const { styles, theme } = useStyles(stylesheet);
	const width = Dimensions.get('window').width;
	const { authToken } = useAuth();
	const { data: billingHistory, isLoading: isLoadingBilling } = useGetBillingHistory();
	const billingDetails = billingHistory?.data?.subscription_billing_cycles;
	const date = activeSubscription?.data?.subscription?.current_billing_cycle;
	const subscriptionStatus = activeSubscription?.data?.subscription_status?.collated_status;
	const navigation = useNavigation<NavigationProp<any>>();

	const formatDate = (isoString: string | number | Date) => {
		const date = new Date(isoString);
		return date.toLocaleDateString('en-GB');
	};

	const handleViewInvoices = useCallback(
		async (invoiceId: string) => {
			if (!invoiceId || !authToken) return;
			let url = `${CONSTANTS.WEB_URL}/subscriptionInvoices?invoice_id=${invoiceId}&token=${authToken}`;

			try {
				await Linking.openURL(url);
			} catch (error) {
				console.error('Error opening invoice link:', error);
			}
		},
		[authToken],
	);

	const renderInvoice = ({ item }: { item: SubscriptionBillingCycle }) => (
		<View style={styles.subContainer}>
			<View style={styles.cardContainer}>
				<View style={styles.StandardText}>
					<Text size="bodyBig" color="regular" weight="bold">
						{formatDate(item?.start_time)}
					</Text>
					<Text size="bodyBig" color="regular" weight="bold">
						₹ {item?.subscription_plan?.price_after_taxes}
					</Text>
				</View>
				<View style={styles.StandardContainer}>
					<Text color="regular" size="bodyMid">
						Base price {`(₹ ${item?.subscription_plan?.base_price})`}, GST 18%(₹ {(parseFloat(item?.subscription_plan?.price_after_taxes) * 1.18).toFixed(2)})
					</Text>
					<Text color="regular" size="bodyMid" style={styles.periodText}>
						Subscription for {formatDate(item?.start_time)} - {formatDate(item?.end_time)}
					</Text>
				</View>
				<Button style={styles.cancelSub} textColor="primary" onPress={() => handleViewInvoices(item.id)}>
					View Invoice
				</Button>
			</View>
		</View>
	);

	const getSubscriptionMessage = () => {
		switch (subscriptionStatus) {
			case CONSTANTS.SUBSCRIPTION_TYPES.REGULAR_ACTIVE:
				return formatDate(date?.end_time);
			case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE:
				return formatDate(date?.end_time);
			case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED:
				return 'Subscription Ended';
			case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE:
				return formatDate(date?.grace_period_end_time);
			case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED:
				return 'Grace period Ended';
			default:
				return '';
		}
	};

	const getSubscriptionLabel = () => {
		switch (subscriptionStatus) {
			case CONSTANTS.SUBSCRIPTION_TYPES.REGULAR_ACTIVE:
				return 'Next Billing Date';
			case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE:
				return 'Subscription Ends On';
			case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED:
			case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED:
				return 'Subscription Ended';
			case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE:
				return 'Grace period Ends On';
			default:
				return '';
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Billing History" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.StandardText}>
							<Text size="bodyBig" color="regular" weight="semibold">
								{['regular_active', 'cancelled_active', 'grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) ? activeSubscription?.data.subscription?.subscription_plan?.name : 'No Active Subscription'}
							</Text>
							<Text size="bodyBig" color="regular" weight="semibold">
								{['regular_active', 'cancelled_active', 'grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) ? `₹ ${activeSubscription?.data.subscription?.subscription_plan?.price_after_taxes}/month` : ''}
							</Text>
						</View>
						<View style={styles.PriceText}>
							<Text size="bodyMid" color="muted">
								{getSubscriptionLabel()} {getSubscriptionMessage()}
							</Text>
						</View>
					</View>
				</View>
				<View style={styles.topMargin} />
				<FlatList
					data={billingDetails}
					keyExtractor={item => item.id}
					renderItem={renderInvoice}
					ListEmptyComponent={
						<View style={styles.emptyContainer}>
							<Text size="bodyBig" color="regular">
								No billing cycles found
							</Text>
						</View>
					}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	scrollContainer: {
		width: '100%',
		marginTop: theme.margins.base,
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		justifyContent: 'space-between',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.padding.xl,
	},
	subContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
	},
	StandardContainer: {
		marginLeft: theme.margins.base,
	},
	PriceText: {
		marginLeft: theme.margins.base,
		marginBottom: theme.margins.base,
	},
	periodText: {
		marginTop: theme.margins.xxs - 1,
	},
	StandardText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: theme.margins.xxs,
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.sm,
	},
	cancelSub: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		borderColor: '#E9BF99',
		borderWidth: 1,
		marginVertical: theme.margins.base,
	},
	GpayIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: theme.margins.xxs - 1,
	},
	iconContainer: {
		backgroundColor: '#F65F5F',
		borderRadius: Dimensions.get('window').width / 4,
		marginLeft: theme.margins.base,
	},
	topMargin: {
		marginBottom: theme.margins.base * 1.8,
	},
}));

export default BillingHistory;
