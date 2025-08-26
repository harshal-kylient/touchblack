import React from 'react';
import { SafeAreaView, ScrollView, View, Dimensions } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text, Button } from '@touchblack/ui';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
import Header from '@components/Header';
import { SheetType } from 'sheets';
import { Close } from '@touchblack/icons';
import { useCancelSubscription } from '@network/useCancelSubscription';

interface IProps {}

export default function CancelSubscription({ route }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const subscription_id = route?.params?.subscription_id;
	const date = route?.params?.date;
	const width = Dimensions.get('window').width;
	const cancelSubscription = useCancelSubscription();

	const handleCancelPress = async () => {
		try {
			await cancelSubscription.mutateAsync(subscription_id);
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.CancelSubscriptionPopup,
				},
			});
		} catch (error) {
			console.error('Error canceling subscription:', error);
		}
	};
	const formatDate = (isoString: string | number | Date) => {
		const date = new Date(isoString);
		return date.toLocaleDateString('en-GB');
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Subscription Management" />
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.userContainer}>
					<Text color="muted" size="bodyBig" style={styles.subtitleText}>
						Your subscription will be active till {formatDate(date)}, {'\n'}
						date after which your plan will be cancelled.
					</Text>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.CancelContainer}>
							<Text color="regular" size="bodyBig" style={styles.textContainerOne}>
								What happens if I cancel?
							</Text>
							<View style={[styles.iconContainer, { borderRadius: width / 4 }]}>
								<Close color={theme.colors.black} size={`${width / 20}`} />
							</View>
						</View>
						<Text color="regular" size="bodyBig" style={styles.textContainerTwo}>
							You will lose access to your mailbox,
						</Text>
						<Text color="regular" size="bodyBig" style={styles.textContainerTwo}>
							showreel, calendar and future project
						</Text>
						<Text color="regular" size="bodyBig" style={styles.textContainerTwo}>
							enquiries from 600+ production houses.
						</Text>
						<Button onPress={handleCancelPress} type="secondary" textColor="primary" style={styles.cancelSub}>
							Yes, I wish to cancel
						</Button>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	scrollContainer: {
		width: '100%',
	},
	userContainer: {
		paddingBottom: theme.padding.lg,
		padding: theme.padding.base,
	},
	subtitleText: {
		fontFamily: 'CabinetGrotesk-Regular',
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: theme.padding.base,
		justifyContent: 'space-between',
	},
	CancelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: theme.margins.xxs,
		justifyContent: 'space-between',
	},
	iconContainer: {
		backgroundColor: '#F65F5F',
		margin: theme.margins.base,
	},
	subContainer: {
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		marginTop: theme.margins.xxxl,
		marginVertical: theme.margins.base,
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
	textContainerOne: {
		marginHorizontal: theme.margins.xxs,
	},
	textContainerTwo: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xxxs,
	},
	cancelSub: {
		marginHorizontal: theme.margins.base,
		backgroundColor: theme.colors.black,
		borderColor: theme.colors.borderGray,
		borderWidth: 1,
		marginVertical: theme.margins.base,
	},
}));
