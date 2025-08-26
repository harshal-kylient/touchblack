import { Text } from '@touchblack/ui';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { LongArrowRight } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import CONSTANTS from '@constants/constants';
const { width } = Dimensions.get('window');

function AssigmManager() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { subscriptionData } = useSubscription();

	const handleManagerPress = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.ASSIGN_MANAGER];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			navigation.navigate('AssignManager');
		}
	};
	return (
		<View style={styles.subContainer}>
			<View style={styles.cardContainer}>
				<Text color="regular" size="bodyBig" style={styles.bannerTextInfo}>
					Is managing stuff getting {'\n'}hectic for you!
				</Text>
				<Text color="regular" size="bodyMid" style={styles.bannerText}>
					We understand that your to-do list is out of control.{'\n'}It’s time to hand over the reins.
				</Text>
				<View style={styles.bannerButtonContainer}>
					<TouchableOpacity style={styles.subscribeNow} onPress={handleManagerPress}>
						<Text style={styles.subscribeNowText} size="bodyMid">
							Assign a Manager
						</Text>
					</TouchableOpacity>
					<View style={styles.arrowContainer}>
						<LongArrowRight onPress={handleManagerPress} color={theme.colors.black} size={width / 15} />
					</View>
				</View>
			</View>
		</View>
	);
}

export default AssigmManager;

const stylesheet = createStyleSheet(theme => ({
	subContainer: {
		flex: 1,
		marginTop: theme.margins.base * 2,
		backgroundColor: theme.colors.backgroundLightBlack,
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

	bannerText: {
		marginHorizontal: theme.margins.sm,
		marginBottom: theme.margins.sm,
		lineHeight: 18,
	},
	bannerTextRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	bannerTextInfo: {
		margin: theme.margins.sm,
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
		paddingHorizontal: theme.padding.sm,
	},
	arrowContainer: {
		backgroundColor: theme.colors.primary,
		padding: theme.padding.xxs,
	},
}));
