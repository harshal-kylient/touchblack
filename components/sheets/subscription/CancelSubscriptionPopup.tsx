import React, { useState } from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Close } from '@touchblack/icons';
import { Button, Text } from '@touchblack/ui';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

interface CancelSubscriptionPopupProps {
	header: string;
	text?: string;
	icon?: JSX.Element;
	onPress?: () => void;
	onPressText?: string;
}

type RootStackParamList = {
	CancelSubscription: undefined;
	RestartSubscription: undefined;
	Subscriptions: undefined;
};

type CancelSubscriptionNavigationProp = NavigationProp<RootStackParamList, 'CancelSubscription'>;

const width = Dimensions.get('window').width;

const CancelSubscriptionPopup: React.FC<CancelSubscriptionPopupProps> = ({ icon, onPress }) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<CancelSubscriptionNavigationProp>();
	const [isVisible, setIsVisible] = useState(true);
	const { refreshRestrictions } = useSubscription();

	const handlePress = () => {
		setIsVisible(false);
		refreshRestrictions();
		navigation.navigate('Subscriptions');
	};

	const handleEmailPress = () => {
		console.log('Email clicked!');
	};

	if (!isVisible) {
		return null;
	}
	const Icon = icon || Close;

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<View style={[styles.CloseContainer, { borderRadius: width / 4 }]}>
					<Close color={theme.colors.black} size={`${width / 8}`} />
				</View>
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="primaryMid" style={styles.regularFontFamily}>
					Subscription Cancelled
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					You will be missed! If there is anything we could {'\n'}do better, please let us know at{' '}
					<TouchableOpacity onPress={handleEmailPress}>
						<Text color="primary" size="bodyBig" style={styles.linkText}>
							Cs@talentgridnow.com
						</Text>
					</TouchableOpacity>
				</Text>
			</View>
			<View style={styles.buttonContainer}>
				<Button onPress={handlePress}>Okay</Button>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: { justifyContent: 'center', alignItems: 'center' },
	iconContainer: {
		width: width / 3,
		height: width / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	CloseContainer: {
		backgroundColor: '#F65F5F',
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
	buttonContainer: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		alignSelf: 'stretch',
		padding: theme.padding.base,
		marginBottom: theme.margins.base,
	},
	linkText: {
		textDecorationLine: 'underline',
		marginLeft: theme.margins.xxxs,
		marginBottom: -theme.margins.xxxs,
	},
}));

export default CancelSubscriptionPopup;
