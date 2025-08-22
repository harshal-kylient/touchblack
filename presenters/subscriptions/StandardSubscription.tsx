import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Dimensions, Linking, Alert } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Button } from '@touchblack/ui';
import { AnimatedImages, CalendarMonth, CameraIndoor, EditDocument, MoneyBag } from '@touchblack/icons';
import Header from '@components/Header';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

type CancelSubscriptionNavigationProp = NavigationProp<RootStackParamList, 'CancelSubscription'>;

const StandardSubscription: React.FC = ({ route }) => {
	const subscriptionPlanId = route?.params?.planId;
	const subscriptionPlanDetails = route?.params?.subscriptionPlan;
	const subscriptionPlan = subscriptionPlanDetails?.data?.subscription_plans[0];
	const subscriptionId = route?.params?.subscriptionId;
	const { authToken } = useAuth();
	const { width } = Dimensions.get('window');
	const { styles, theme } = useStyles(stylesheet);
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const navigation = useNavigation<CancelSubscriptionNavigationProp>();
	subscriptionId;
	const handleSubscription = async () => {
		if (subscriptionId) {
			await handlePaymentRedirect(subscriptionId);
		} else {
			navigation.navigate('UserDetails', { planId: subscriptionPlanId });
		}
	};

	const handlePaymentRedirect = async (subsId: string) => {
		let url = `${CONSTANTS.WEB_URL}/oneTimePayment?subscription_id=${subsId}&token=${authToken}`;
		try {
			await Linking.openURL(url);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<SafeAreaView style={styles.container}>
			<Header name="Subscription" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.userContainer}>
					<Text size="bodyBig" color="regular" style={styles.subtitleText}>
						{subscriptionPlan?.name}
					</Text>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.iconText}>
							<MoneyBag color={theme.colors.primary} size={width / 20} />
							<Text size="primaryMid" color="regular">
								Rs {subscriptionPlan?.price_after_taxes}/month
							</Text>
						</View>

						<Text color="muted" size="bodySm" style={styles.textContainer}>
							Base Price:rs {subscriptionPlan?.base_price}+GST 18%
						</Text>
					</View>
				</View>

				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.iconText}>
							<CameraIndoor color={theme.colors.primary} size={width / 20} />
							<Text size="bodyBig" color="regular">
								Access 600+ production Houses
							</Text>
						</View>
						<Text color="muted" size="bodySm" style={styles.textContainer}>
							Right when they are crewing of up for a project
						</Text>
					</View>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.iconText}>
							<AnimatedImages color={theme.colors.primary} size={width / 20} />
							<Text size="bodyBig" color="regular">
								Verified Showreels with filters
							</Text>
						</View>
						<Text color="muted" size="bodySm" style={styles.textContainer}>
							So production houses can find relevent work your reel from ,instantly
						</Text>
					</View>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.iconText}>
							<EditDocument color={theme.colors.primary} size={width / 20} />
							<Text size="bodyBig" color="regular">
								Clear project briefs
							</Text>
						</View>
						<Text color="muted" size="bodySm" style={styles.textContainer}>
							with script, dates and location from verified production houses
						</Text>
					</View>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.iconText}>
							<CalendarMonth color={theme.colors.primary} size={width / 20} />
							<Text size="bodyBig" color="regular">
								Work Calendar
							</Text>
						</View>
						<Text color="muted" size="bodySm" style={styles.textContainer}>
							That syncs all your online and offline, enquiries, tentavies and confirmed bookings.
						</Text>
					</View>
				</View>
			</ScrollView>

			<Button onPress={handleSubscription} style={styles.cancelSub} type="primary" textColor="primary">
				Pay Now
			</Button>
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	scrollContainer: {
		width: '100%',
	},
	userContainer: {
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
		paddingBottom: theme.padding.base,
		flexDirection: 'row',
		alignItems: 'center',
	},
	subtitleText: {
		opacity: 0.8,
		margin: theme.margins.base,
	},

	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: theme.padding.base,
		justifyContent: 'space-between',
	},
	subContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	borderContainer: {
		borderColor: '#ccc',
		borderRadius: 4,
		padding: theme.padding.base,
		margin: theme.margins.base,
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
	},
	textContainer: {
		marginLeft: 40,
		marginBottom: theme.margins.base,
	},
	iconText: {
		flexDirection: 'row',
		alignItems: 'center',
		margin: theme.margins.base,
		gap: 10,
	},

	cancelSub: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		borderColor: '#E9BF99',
		borderWidth: 1,
		marginBottom: 40,
	},
}));

export default StandardSubscription;
