import React, { useState, useCallback } from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Diamond } from '@touchblack/icons';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import { SheetManager } from 'react-native-actions-sheet';
import CONSTANTS from '@constants/constants';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
	UserDetails: undefined;
};

type SubscriptionPopupNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

interface IProps {
	data: string;
}

const SubscriptionPopup: React.FC<IProps> = ({ data }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	const subscriptionPlan = subscriptionPlans?.data?.subscription_plans?.length ? subscriptionPlans.data.subscription_plans[0] : null;
	const navigation = useNavigation<SubscriptionPopupNavigationProp>();
	const optOutDisabled = data === CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ENDED;
	const handlePopUp = () => {
		SheetManager.hide('Drawer');
	};

	const handleSubscribe = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans });
	}, [navigation, subscriptionPlan]);

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>
				<Diamond color={theme.colors.success} size={width / 5} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryBig" style={styles.regularFontFamily}>
					Sign me up!
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					This is where India's leading production houses find their crew and top talent meets epic work. Don't miss out!
				</Text>

				{isLoadingSubsPlans ? (
					<ActivityIndicator size="small" color={theme.colors.typography} />
				) : (
					<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
						₹{subscriptionPlan?.price_after_taxes}/month (₹{subscriptionPlan?.base_price} + 18% GST)
					</Text>
				)}
			</View>
			<View style={styles.btnContainer}>
				{!optOutDisabled && (
					<Button onPress={handlePopUp} type="secondary" textColor="regular" style={styles.skipButton}>
						Opt Out
					</Button>
				)}
				<Button onPress={handleSubscribe} type="primary" style={[optOutDisabled ? styles.subscribeButton : styles.subscribeButtonDisabled]}>
					Subscribe Now
				</Button>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	subscriptionPop: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		width: width / 3,
		height: width / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.lg,
		gap: theme.gap.sm,
		alignSelf: 'stretch',
	},
	regularFontFamily: {
		textAlign: 'center',
	},
	btnContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	StandardText: {
		margin: theme.margins.base,
		gap: theme.gap.base,
	},
	skipButton: {
		width: '50%',
	},
	subscribeButton: {
		width: '100%',
	},
	subscribeButtonDisabled: {
		width: '50%',
	},
	subContainer: {
		position: 'absolute',
		bottom: 510,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	bannerText: {
		fontSize: theme.fontSize.primaryH3,
	},
	bannerTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	bannerTextInfo: {
		marginLeft: theme.margins.base,
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
	},
	arrowContainer: {
		backgroundColor: theme.colors.primary,
		padding: theme.padding.base,
	},
}));

export default SubscriptionPopup;
