import { Text } from '@touchblack/ui';
import { View, Dimensions, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import CONSTANTS from '@constants/constants';

const { width } = Dimensions.get('window');
interface IProps {
	data: string;
}

const ChangeManagerBanner: React.FC<IProps> = ({ data }) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<ManagerChange>();
	const { subscriptionData } = useSubscription();

	const handleChange = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.CHANGE_MANAGER];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			navigation.navigate('ChangeManager');
		}
	};

	return (
		<View style={styles.subContainer}>
			<View style={styles.textContainer}>
				<Text color="regular" size="bodyMid" style={styles.headingText}>
					{data} is your assigned manager.
				</Text>
				<Pressable onPress={handleChange}>
					<Text color="primary" size="bodyMid">
						Change
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

export default ChangeManagerBanner;

const stylesheet = createStyleSheet(theme => ({
	subContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	textContainer: {
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.sm,
		justifyContent: 'space-between',
		backgroundColor: theme.colors.black,
	},
	headingText: {
		flex: 1,
	},
}));
