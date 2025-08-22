import React, { useState, useCallback } from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Verified } from '@touchblack/icons';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useGetManagerStatus } from '@network/useGetManagerStatus';

const { width } = Dimensions.get('window');

interface IProps {
	data: string;
}

const ManagerSuccessPopup: React.FC<IProps> = ({ data }) => {
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);
	const { data: managerStatus } = useGetManagerStatus();
	const managerName = managerStatus?.data?.manager_talent?.manager?.full_name;

	const handleManager = useCallback(() => {
		SheetManager.hide('Drawer');
		navigation.navigate('Home');
	}, [navigation]);

	if (!isPopupVisible) return null;

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>
				<Verified color={theme.colors.success} size={width / 5} />
			</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="secondary" style={styles.regularFontFamily}>
					Success
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{managerName} is assigned as your new manager
				</Text>
			</View>
			<View style={styles.btnContainer}>
				<Button onPress={handleManager} type="primary" style={styles.subscribeButton}>
					Continue
				</Button>
			</View>
		</View>
	);
};

export default ManagerSuccessPopup;

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
	subscribeButton: {
		width: '100%',
	},
	bannerText: {
		fontFamily: 'CabinetGrotesk-Regular',
		fontSize: theme.fontSize.primaryH3,
	},
}));
