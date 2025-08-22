import React, { useState } from 'react';
import { View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text, Button } from '@touchblack/ui';
import { Radio, RadioFilled } from '@touchblack/icons';
import Header from '@components/Header';
import { Person } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Switch from '@components/Switch';
import SearchInput from '@components/SearchInput';
import useGetSearchManagers from '@network/useGetSearchManagers';
import { useManagerInitiate } from '@network/usePostInitiateManager';
import UserNotFound from '@components/errors/UserNotFound';
import CONSTANTS from '@constants/constants';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

const AssignManager = () => {
	const { styles, theme } = useStyles(stylesheet);
	const [selectedManager, setSelectedManager] = useState('');
	const [message, setMessage] = useState('');
	const [invoiceStatus, setInvoiceStatus] = useState(false);
	const [query, setQuery] = useState('');
	const { data: response } = useGetSearchManagers(query.toLowerCase().trim());
	const { mutate: postManagerInitiate } = useManagerInitiate();
	const managers = response?.results;
	const [step, setStep] = useState(1);
	const navigation = useNavigation();

	const handleInvoiceToggle = () => {
		setInvoiceStatus(prev => !prev);
	};
	const handleGoBack = () => {
		if (step === 2) {
			setStep(1);
			return true;
		}
		return false;
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
						}
					},
					onError: error => {
						setMessage(error);
					},
				},
			);
		}
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
			<Header name="Assign a Manager" onBackPressStepLogic={handleGoBack} />
			<View style={styles.assignManagerSubView}>
				{step === 1 && (
					<View>
						<View style={styles.detailsContainer}>
							<Text size="bodyBig" color="muted" style={styles.heading}>
								The manager you have assigned will have {'\n'} complete access to:
							</Text>
							<Text size="bodyBig" color="muted" style={styles.textStyle}>
								• Your message mailbox
							</Text>
							<Text size="bodyBig" color="muted" style={styles.textStyle}>
								• Your calendar and availability
							</Text>
							<Text size="bodyBig" color="muted" style={styles.textStyle}>
								• Your project and schedule details
							</Text>
							<Text size="bodyBig" color="muted" style={styles.textStyle}>
								• All your financial and invoice management data.
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
						<SearchInput placeholderText="Search Manager" searchQuery={query} setSearchQuery={setQuery} />
						<View style={styles.flatListView}>
							<FlashList
								data={managers}
								renderItem={renderItem}
								keyExtractor={item => item.id.toString()}
								estimatedItemSize={80}
								extraData={selectedManager}
								ListEmptyComponent={
									<View style={styles.emptyComponent}>
										<UserNotFound title="No Manager's available !" desc="You’ll see managers and will be able to assign them once they are on platform." />
									</View>
								}
							/>
						</View>
					</View>
				)}
			</View>
			<Text size="bodyBig" color="muted" style={styles.tipTextStyle}>
				Note : Please ensure the manager is someone you trust before proceeding with this assignment.
			</Text>
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
	assignManagerView: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	assignManagerSubView: {
		flex: 1,
	},
	emptyComponent: { flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' },
	flatListView: {
		flex: 1,
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
		paddingVertical: theme.padding.xxxs,
	},
}));

export default AssignManager;
