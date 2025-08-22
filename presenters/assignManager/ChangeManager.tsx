import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Pressable, Dimensions, Image, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text, Button } from '@touchblack/ui';
import { Delete, Radio, RadioFilled } from '@touchblack/icons';
import Header from '@components/Header';
import { Person } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import SearchInput from '@components/SearchInput';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import Switch from '@components/Switch';
import useGetSearchManagers from '@network/useGetSearchManagers';
import { useManagerInitiate } from '@network/usePostInitiateManager';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

const { width } = Dimensions.get('window');

const ChangeManager = () => {
	const { styles, theme } = useStyles(stylesheet);
	const [selectedManager, setSelectedManager] = useState('');
	const [message, setMessage] = useState('');
	const [invoiceStatus, setInvoiceStatus] = useState(false);
	const [query, setQuery] = useState('');
	const [step, setStep] = useState(1);
	const { data: response } = useGetSearchManagers(query.toLowerCase().trim());
	const { mutate: postManagerInitiate } = useManagerInitiate();
	const managers = response?.results;
	const { data: managerStatus } = useGetManagerStatus();
	const currentManagerDetails = managerStatus?.data?.manager_talent?.manager;
	const managerId = managerStatus?.data?.manager_talent?.manager?.id;
	const managerTalentId = managerStatus?.data?.manager_talent?.id;
	// Assuming each manager object has an `id` field
	const currentManagerId = currentManagerDetails?.id;

	// Filter out current manager
	const filteredManagers = (managers ?? []).filter(manager => manager.id !== currentManagerId);

	
	const navigation = useNavigation();
	useEffect(() => {
		setSelectedManager(managerId);
	}, [managerId]);

	const handleGoBack = () => {
		if (step === 2) {
			setStep(1);
			return true;
		}
		return false;
	};

	const handleInvoiceToggle = () => {
		setInvoiceStatus(prev => !prev);
	};
	const handleRadioButtonClick = (managerId: string) => {
		if (selectedManager === managerId) {
			setSelectedManager('');
		} else {
			setSelectedManager(managerId);
			setMessage('');
		}
	};
	const handleSendOtp = () => {
		if (selectedManager === '') {
			setMessage('Please select the manager');
		} else {
			const managerId = selectedManager;
			postManagerInitiate(
				{ managerId, invoiceStatus },
				{
					onSuccess: data => {
						if (data?.success) {
							const managerTalentId = data?.data?.manager_talent?.id;
							navigation.navigate('ManagerOtpValidation', { managerTalentId });
						} else if (!data?.success) {
							setMessage(data.message);
						}
					},
					onError: error => {
						setMessage(error);
					},
				},
			);
		}
	};
	const handleRemoveManager = () => {
		SheetManager.show('Drawer', { payload: { sheet: SheetType.RemoveManagerPopup, data: managerTalentId } });
	};

	const renderItem = ({ item }) => (
		<View style={styles.container}>
			<View style={styles.imgContainer}>
				<View style={styles.imgContainer}>{item?.profile_picture_url ? <Image src={createAbsoluteImageUri(item?.profile_picture_url)} style={{ flex: 1, height: 67, width: 67 }} /> : <Person color={theme.colors.muted} />}</View>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.textContainer}>
					<Text size="button" color="regular">
						{item?.full_name}
					</Text>
					<Text size="bodySm" color="muted">
						{item?.profession_name}
					</Text>
				</View>
				<View>
					<TouchableOpacity onPress={() => handleRadioButtonClick(item.id)} activeOpacity={0.7} style={styles.radioButtonContainer}>
						{selectedManager === item.id ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.borderGray} />}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.assignManagerView}>
			<Header name="Change Manager" onBackPressStepLogic={handleGoBack} />
			<View style={styles.assignManagerSubView}>
				{step === 1 && (
					<View>
						<View style={styles.detailsContainer}>
							<Text size="bodyBig" color="muted" style={styles.textStyle}>
								Assigning a new manager will automatically revoke the access of the current manager. They will no longer have access to your details and the new manager will have complete access to your historical data as well. Do you wish to continue?
							</Text>
						</View>
						<View>
							<Text size="bodySm" color="regular" style={styles.permissionText}>
								Permissions
							</Text>
							<View style={styles.switchContainerOne}>
								<View style={styles.switchContainerTwo}>
									<Text size="bodySm" color="regular">
										Raise an invoice
									</Text>
									<Switch value={invoiceStatus} onToggle={handleInvoiceToggle} />
								</View>
							</View>
							<Text size="bodySm" color="muted" style={styles.tipTextStyle}>
								Tip: Enabling this option will apply the manager’s GST details to invoices. If disabled, your GST details will be used.
							</Text>
						</View>
					</View>
				)}
				{step === 2 && (
					<View style={styles.flatListView}>
						<SearchInput placeholderText="Search Managers" searchQuery={query} setSearchQuery={setQuery} />
						<View style={styles.flatListView}>
							<Text color="regular" size="bodyMid" style={styles.managerListText}>
								Existing Manager
							</Text>
							<View style={styles.container}>
								<View style={styles.imgContainer}>
									<View style={styles.imgContainer}>{currentManagerDetails?.profile_picture_url ? <Image src={createAbsoluteImageUri(currentManagerDetails?.profile_picture_url)} style={{ flex: 1, height: 67, width: 67 }} /> : <Person color={theme.colors.muted} />}</View>
								</View>
								<View style={styles.contentContainer}>
									<View style={styles.textContainer}>
										<Text size="button" color="regular">
											{currentManagerDetails?.full_name}
										</Text>
										<Text size="bodySm" color="muted">
											{currentManagerDetails?.profession_name}
										</Text>
									</View>
								</View>
							</View>
							<Text color="regular" size="bodyMid" style={styles.managerListText}>
								Other Managers
							</Text>
							<FlashList data={filteredManagers} renderItem={renderItem} keyExtractor={item => item.id.toString()} estimatedItemSize={80} extraData={selectedManager} />
						</View>
					</View>
				)}
			</View>
			{step === 2 && (
				<Pressable onPress={handleRemoveManager} style={styles.removeButton}>
					<Delete color={theme.colors.typography} size={width / 20} />
					<Text color="regular" size="bodyMid" style={styles.removeManagerText}>
						Remove manager
					</Text>
				</Pressable>
			)}

			{message ? (
				<Text size="bodyMid" textAlign="center" color="error" style={styles.errorText}>
					{message}
				</Text>
			) : null}
			<View style={styles.btnContainer}>
				{step === 1 ? (
					<Button onPress={() => setStep(2)} type="primary" style={styles.continueButton}>
						Continue
					</Button>
				) : (
					<Button onPress={handleSendOtp} type="primary" style={styles.continueButton}>
						Send OTP
					</Button>
				)}
			</View>
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	detailsContainer: {
		padding: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	flatListView: {
		flex: 1,
	},
	assignManagerView: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	assignManagerSubView: {
		flex: 1,
	},
	managerListText: {
		padding: theme.padding.sm,
	},
	removeButton: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.xs,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	removeManagerText: {
		paddingHorizontal: theme.padding.xxs,
	},
	heading: {
		paddingBottom: theme.padding.lg,
		lineHeight: 18,
	},
	errorText: {
		paddingBottom: theme.padding.xxs,
	},
	tipTextStyle: {
		paddingHorizontal: theme.padding.sm,
		paddingVertical: theme.padding.sm,
		lineHeight: 18,
	},
	textStyle: {
		paddingVertical: theme.padding.xxxs,
		lineHeight: 20,
	},
	permissionText: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		paddingTop: theme.padding.sm,
	},
	switchContainerOne: {
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
	},
	switchContainerTwo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.sm,
		marginHorizontal: theme.padding.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		paddingVertical: theme.padding.base,
		borderColor: theme.colors.borderGray,
	},
	searchContainer: {
		flexDirection: 'row',
		margin: theme.padding.base,
	},
	searchIcon: {
		position: 'absolute',
		top: 15,
		left: 12,
		zIndex: 999,
	},
	searchInput: {
		flex: 1,
		backgroundColor: theme.colors.black,
		paddingLeft: 42,
	},
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flexDirection: 'row',
		paddingLeft: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	imgContainer: {
		width: 68,
		height: 68,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	contentContainer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		alignItems: 'center',
		flex: 1,
	},
	textContainer: {
		flex: 1,
	},
	continueButton: {
		width: '100%',
	},
	btnContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	radioButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: theme.padding.base,
		paddingVertical:theme.padding.xxxs,
		
	},
}));

export default ChangeManager;
