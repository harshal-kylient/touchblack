import React, { useState, useCallback } from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Diamond } from '@touchblack/icons';
import { useGetSubscriptionPlans } from '@network/useGetSubscriptionPlans';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetSubscriptionCurrentStatus } from '@network/useGetSubscriptionCurrentStatus';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
	UserDetails: undefined;
};

type SubscriptionPopupNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

interface IProps {
	data: {
		screen_id: string;
		header: string;
		description: string;
		footer: string;
	};
}

const SubscriptionRestrictionPopup: React.FC<IProps> = ({ data }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const { data: subscriptionPlans, isLoading: isLoadingSubsPlans } = useGetSubscriptionPlans();
	const subscriptionPlan = subscriptionPlans?.data?.subscription_plans[0];
	const { data: subsCurrentStatus, refetch } = useGetSubscriptionCurrentStatus();
	const subscriptionStatus = subsCurrentStatus?.data?.subscription_status?.collated_status;
	const subscriptionId = subsCurrentStatus?.data?.subscription?.id;
	const navigation = useNavigation<SubscriptionPopupNavigationProp>();
	const handlePopUp = () => {
		SheetManager.hide('Drawer');
	};
	const handleSubscribeNow = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans });
	}, [navigation, subscriptionPlan]);

	const handlePayNow = useCallback(() => {
		if (!subscriptionPlan?.id) {
			return;
		}
		SheetManager.hide('Drawer');
		navigation.navigate('StandardSubscription', { planId: subscriptionPlan?.id, subscriptionPlan: subscriptionPlans, subscriptionId: subscriptionId });
	}, [navigation, subscriptionPlan, subscriptionId]);

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>
				<Diamond size={width / 5} color={theme.colors.success} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					{data?.header}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{data?.description}
				</Text>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					{data?.footer}
				</Text>
			</View>
			<View style={styles.btnContainer}>
				<Button onPress={handlePopUp} type="secondary" textColor="regular" style={styles.skipButton}>
					Opt Out
				</Button>

				{loginType === 'manager' ? (
					<Button onPress={handlePopUp} type="primary" style={styles.subscribeButton}>
						Okay
					</Button>
				) : subscriptionStatus === CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED ? (
					<Button onPress={handlePayNow} type="primary" style={styles.subscribeButton}>
						Pay Now
					</Button>
				) : (
					<Button onPress={handleSubscribeNow} type="primary" style={styles.subscribeButton}>
						Subscribe Now
					</Button>
				)}
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

export default SubscriptionRestrictionPopup;
