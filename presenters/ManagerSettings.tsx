import { useState } from 'react';
import { View, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { NavigationProp } from '@react-navigation/native';
import { Button, Text } from '@touchblack/ui';
import { ArrowRight } from '@touchblack/icons';
import Header from '@components/Header';
import useHandleLogout from '@utils/signout';
import contactSupport from '@utils/contactSupport';
export type SettingsProps = {
	navigation: NavigationProp<any>;
};

interface ListItem {
	id: string;
	label: string;
	screen?: string;
}

export default function ManagerSettings({ navigation }: SettingsProps) {
	const { styles } = useStyles(stylesheet);
	const [loading, setLoading] = useState(false);
	const logout = useHandleLogout(true);

	let data: ListItem[] = [
		{ id: 'gstin', label: 'GSTIN Details', screen: 'GSTList' },
		{ id: 'privacy', label: 'Privacy Policy', screen: 'PrivacyPolicy' },
		{ id: 'terms', label: 'Terms and Conditions', screen: 'TermsAndConditions' },
		{ id: 'contact', label: 'Contact Support' },
	];

	async function handleLogout() {
		setLoading(true);
		return await logout();
	}

	const handleListItemPress = async (item: ListItem) => {
		if (item.id === 'contact') {
			await contactSupport();
		} else if (item.screen) {
			navigation.navigate(item.screen);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Settings" />
			<ScrollView>
				{data.map((item, index) => (
					<View key={item.id} style={styles.subContainer(index, data)}>
						<View style={styles.cardContainer}>
							<Pressable style={styles.card} onPress={() => handleListItemPress(item)}>
								<Text color="regular" weight="regular" size="secondary">
									{item.label}
								</Text>
								<ArrowRight color="white" size="20" />
							</Pressable>
						</View>
					</View>
				))}
			</ScrollView>
			<Button onPress={handleLogout} style={styles.mBase} type="primary">
				{loading ? 'Logging out...' : 'Logout'}
			</Button>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: 10,
		justifyContent: 'space-between',
	},
	mBase: { marginHorizontal: theme.margins.base },
	subContainer: (index: number, data: ListItem[]) => ({
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: index === data.length - 1 ? theme.borderWidth.slim : 0,
	}),
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
		padding: theme.padding.base,
	},
	button: {
		flexGrow: 1,
		marginHorizontal: theme.margins.base,
		marginBottom: theme.margins.xxl,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
}));
