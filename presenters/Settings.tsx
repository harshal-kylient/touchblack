import { useState } from 'react';
import { View, SafeAreaView, Pressable, ScrollView } from 'react-native';

import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { NavigationProp } from '@react-navigation/native';
import { Button, Text } from '@touchblack/ui';
import { ArrowRight } from '@touchblack/icons';

import { useAuth } from './auth/AuthContext';
import { SheetType } from 'sheets';
import Header from '@components/Header';
import useGetProducerAbout from '@network/useGetProducerAbout';
import useHandleLogout from '@utils/signout';
import contactSupport from '@utils/contactSupport';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import CONSTANTS from '@constants/constants';
import { useSubscription } from './subscriptions/subscriptionRestrictionContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SettingsProps = {
	navigation: NavigationProp<any>;
};

interface ListItem {
	id: string;
	label: string;
	screen?: string;
}

export default function Settings({ navigation }: SettingsProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { producerId, loginType, userId, businessOwnerId } = useAuth();
	const [loading, setLoading] = useState(false);
	const logout = useHandleLogout(true);
	const { subscriptionData } = useSubscription();
	const { data: managerStatus } = useGetManagerStatus();
	const managerId = managerStatus?.data?.manager_talent;
	const { data: producerData } = useGetProducerAbout();
	const insets = useSafeAreaInsets();

	let data: ListItem[] = [
		{ id: 'email', label: 'Add your Email', screen: 'AddYourEmail' },
		{ id: 'invoices', label: 'Invoices', screen: 'Invoices' },
		{ id: 'gstin', label: 'GSTIN Details', screen: 'GSTList' },
		{ id: 'pan', label: 'PAN Card Details', screen: 'PanCardDetails' },
		{ id: 'bank', label: 'Bank Details', screen: 'BankDetails' },
		{ id: 'payment', label: 'Payments', screen: 'Payments' },
		{ id: 'block', label: 'Block List', screen: 'BlockList' },
		{ id: 'delete', label: 'Delete Account' },
		{ id: 'privacy', label: 'Privacy Policy', screen: 'PrivacyPolicy' },
		{ id: 'terms', label: 'Terms and Conditions', screen: 'TermsAndConditions' },
		{ id: 'contact', label: 'Contact Support' },
	];
	const insertAtIndex = (arr: ListItem[], index: number, newItem: ListItem) => {
		arr.splice(index, 0, newItem);
	};
	if (loginType !== 'producer') {
		const managerScreen = managerId ? 'ChangeManager' : 'AssignManager';
		const managerLabel = managerId ? 'Change Manager' : 'Assign Manager';
		insertAtIndex(data, 2, { id: 'manager', label: managerLabel, screen: managerScreen });
	}

	if (loginType !== 'producer') {
		insertAtIndex(data, 5, { id: 'Subscription', label: 'Subscriptions', screen: 'Subscriptions' });
	}
	if (producerId && userId) {
		data.push({ id: 'switch', label: 'Switch Profile' });
	}
	if (loginType === 'producer' && userId !== businessOwnerId) {
		data = data.filter(item => item.id !== 'invoices' && item.id !== 'gstin' && item.id !== 'pan' && item.id !== 'bank' && item.id !== 'payment' && item.id !== 'delete');
	}

	if (loginType === 'studio') {
		data = data.filter(item => item.id !== 'invoices' && item.id !== 'block');
	}

	const toggleDrawer = () => {
		if (producerId) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SwitchProfile,
					data: [loginType, producerData],
				},
			});
		}
	};

	async function handleLogout() {
		setLoading(true);
		return await logout();
	}

	const handleListItemPress = async (item: ListItem) => {
		const currentProducerId = producerId;
		if (item.id === 'contact') {
			await contactSupport();
		} else if (item.id === 'delete') {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.DeleteAccount,
				},
			});
		} else if (item.id === 'switch' && currentProducerId) {
			toggleDrawer();
		} else if (item.id === 'manager') {
			const managerScreen = managerId ? 'ChangeManager' : 'AssignManager';
			const restrictionKey = managerId ? CONSTANTS.POPUP_TYPES.CHANGE_MANAGER : CONSTANTS.POPUP_TYPES.ASSIGN_MANAGER;
			const restriction = subscriptionData[restrictionKey];

			if (restriction?.data?.popup_configuration) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.SubscriptionRestrictionPopup,
						data: restriction.data.popup_configuration,
					},
				});
			} else {
				navigation.navigate(managerScreen);
			}
		} else if (item.screen) {
			navigation.navigate(item.screen);
		}
	};

	return (
		<SafeAreaView style={[styles.container]}>
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
