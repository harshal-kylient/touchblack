import React from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Dangerous, Verified } from '@touchblack/icons';
import { SheetManager } from 'react-native-actions-sheet';
import CONSTANTS from '@constants/constants';

const { width } = Dimensions.get('window');

type RootStackParamList = {
	UserDetails: undefined;
};

type SubscriptionPopupNavigationProp = NavigationProp<RootStackParamList, 'UserDetails'>;

interface IProps {
	data: 'success' | 'failed';
}

const SubscriptionConfirmationPopup: React.FC<IProps> = ({ data }) => {
	const { styles, theme } = useStyles(stylesheet);
	const status = data;
	const navigation = useNavigation<SubscriptionPopupNavigationProp>();
	const popupContent = CONSTANTS.SUBSCRIPTION_STATUS_POPUP_CONTENT[status];

	const handlePopUp = () => {
		SheetManager.hide('Drawer');
	};
	const handleRetry = () => {
		SheetManager.hide('Drawer');
		navigation.navigate('Subscriptions');
	};

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>{status === 'success' ? <Verified color={theme.colors.success} size={width / 5} /> : <Dangerous color={theme.colors.destructive} size={width / 5} />}</View>

			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryBig" style={styles.regularFontFamily}>
					{popupContent?.title}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{popupContent?.message}
				</Text>
			</View>

			<View style={styles.btnContainer}>
				{status === 'success' ? (
					<Button onPress={handlePopUp} type="primary" style={styles.subscribeButton}>
						Let's go
					</Button>
				) : (
					<Button onPress={handleRetry} type="primary" style={styles.subscribeButton}>
						Retry
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
	subscribeButton: {
		width: '100%',
	},
}));

export default SubscriptionConfirmationPopup;
