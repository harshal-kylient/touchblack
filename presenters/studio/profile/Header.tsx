import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@touchblack/ui';
import { Settings } from '@touchblack/icons';

const Header: React.FC = () => {
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);

	const handleSettingsPress = () => {
		navigation.navigate('Settings');
	};

	return (
		<View style={styles.header}>
			<Text size="primaryMid" color="regular">
				Profile
			</Text>
			<Pressable onPress={handleSettingsPress} accessibilityRole="button" accessibilityLabel="Settings">
				<Settings size="24" color={theme.colors.typography} />
			</Pressable>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	header: {
		paddingHorizontal: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		zIndex: 1,
		paddingBottom: theme.margins.xxl,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));

export default Header;
