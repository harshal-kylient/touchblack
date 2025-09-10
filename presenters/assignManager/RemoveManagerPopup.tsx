import React, { useState } from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Delete } from '@touchblack/icons';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useRemoveManager } from '@network/useRemoveManager';
import { useQueryClient } from '@tanstack/react-query';

const { width } = Dimensions.get('window');

interface IProps {
	data: string;
}

const RemoveManagerPopup: React.FC<IProps> = ({ data }) => {
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { styles, theme } = useStyles(stylesheet);
	const { mutate: removeManager } = useRemoveManager();

	const handleRemoveManager = async () => {
		const id = data;
		removeManager(
			{ id },
			{
				onSuccess: data => {
					if (data?.success) {
						queryClient.invalidateQueries(['managerStatus']);
						SheetManager.hide('Drawer');
						navigation.navigate('TabNavigator', { screen: 'Home' });
					}
				},
				onError: error => {
					console.log(error);
				},
			},
		);
	};

	const handlePopUp = () => {
		SheetManager.hide('Drawer');
	};

	if (!isPopupVisible) return null;

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>
				<Delete color={theme.colors.success} size={width / 6} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="secondary" style={styles.regularFontFamily}>
					Remove manager!
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					The access of your account will come back in your hand.
				</Text>
			</View>
			<View style={styles.btnContainer}>
				<Button onPress={handlePopUp} type="secondary" textColor="regular" style={styles.skipButton}>
					Cancel
				</Button>
				<Button onPress={handleRemoveManager} type="primary" style={styles.subscribeButton}>
					Confirm
				</Button>
			</View>
		</View>
	);
};

export default RemoveManagerPopup;

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
	skipButton: {
		width: '50%',
	},
	subscribeButton: {
		width: '50%',
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
	bannerText: {
		fontFamily: 'CabinetGrotesk-Regular',
		fontSize: theme.fontSize.primaryH3,
	},
}));
