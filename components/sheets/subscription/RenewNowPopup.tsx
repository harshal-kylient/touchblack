import React, { useCallback, useState } from 'react';
import { Button, Text } from '@touchblack/ui';
import { ErrorFilled } from '@touchblack/icons';
import { View, Dimensions, ActivityIndicator } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import { SheetManager } from 'react-native-actions-sheet';
import CONSTANTS from '@constants/constants';

type RootStackParamList = {
	UserDetails: undefined;
	PayNowSubscription: undefined;
};

const width = Dimensions.get('window').width;

type SubscriptionPopupNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

interface IProps {
	status: string;
	id: string;
}

const RenewNowPopup: React.FC<IProps> = ({ status, id }) => {
	const { styles, theme } = useStyles(stylesheet);
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	const subscriptionPlan = subscriptionPlans?.data?.subscription_plans[0];
	const navigation = useNavigation<SubscriptionPopupNavigationProp>();
	const optOutDisabled = status === CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED;
	const subscriptionId = id;
	const handlePopUp = () => {
		SheetManager.hide('Drawer');
	};

	const handleSubscribe = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans, subscriptionId: subscriptionId });
	}, [navigation, subscriptionPlan, subscriptionId]);

	if (!isPopupVisible) {
		return null;
	}

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>
				<ErrorFilled color={theme.colors.destructive} size={`${width / 4}`} />
			</View>

			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					{optOutDisabled ? 'The Grace period has ended' : 'Hurry! Your subscription has entered the grace period.'}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					Please make the payment to continue using Talent Grid.
					{isLoadingSubsPlans ? (
						<ActivityIndicator size="small" color={theme.colors.typography} />
					) : (
						<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
							{' '}
							₹{subscriptionPlan?.price_after_taxes}/month (₹{subscriptionPlan?.base_price} + 18% GST)
						</Text>
					)}
				</Text>
			</View>

			<View style={styles.btnContainer}>
				{!optOutDisabled && (
					<Button onPress={handlePopUp} type="secondary" textColor="regular" style={styles.skipButton}>
						Skip
					</Button>
				)}
				<Button onPress={handleSubscribe} type="primary" style={[optOutDisabled ? styles.subscribeButton : styles.subscribeButtonDisabled]}>
					Pay Now
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
		fontFamily: 'CabinetGrotesk-Regular',
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
	skipButton: {
		width: '50%',
	},
	subscribeButton: {
		width: '100%',
	},
	subscribeButtonDisabled: {
		width: '50%',
	},
}));

export default RenewNowPopup;
