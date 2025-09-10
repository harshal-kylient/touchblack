import { useCallback, useState } from 'react';
import { Alert, Platform, ToastAndroid, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, RadioGroup } from '@touchblack/ui';
import { useQueryClient } from '@tanstack/react-query';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import { SheetType } from 'sheets';
import Asterisk from '@components/Asterisk';
import { Error } from '@touchblack/icons';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

export type knowThiPersonSheetProps = {
	data?: {
		talentAbut: any;
		id: string;
	};
};

export default function KnowThisPersonSheet({ talentAbout, id }) {
	const navigation = useNavigation();
	const { userId, producerId, loginType } = useAuth();
	const { styles, theme } = useStyles(stylesheet);
	const [error, setError] = useState<string | null>(null);
	const [serverError, setServerError] = useState({ success: false, message: '' });
	const [selectedId, setSelectedId] = useState<string | undefined>(loginType === 'talent' ? userId! : producerId!);
	const { subscriptionData } = useSubscription();

	const radioButtons = [
		{ id: '1', label: "It's Me" },
		{ id: '2', label: "It's someone i know" },
	];

	const handleRadioPress = (id: string) => {
		setSelectedId(id);
	};

	const handleKnownPersonAsync = async () => {
		if (!selectedId) {
			setError('Choose an option to continue.');
			return;
		}
		try {
			await SheetManager.hide('Drawer');
			await new Promise(resolve => setTimeout(resolve, 100));
			if (selectedId === '1') {
				handleClaimAccountPopUp();
			} else {
				navigation.navigate('KnownPerson', { id });
			}
		} catch (error) {
			console.error('Sheet transition error:', error);
		}
	};

	const handleClaimAccountPopUp = () => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.CLAIM_ACCOUNT];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			handleClaimButtonPress();
		}
	};

	const handleClaimButtonPress = useCallback(async () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: 'Warning !',
					icon: Error,
					text: 'Looks like you’re ready to claim this profile! Just a quick note: if the claim turns out to be incorrect, we will have to suspend your account forever. Let’s make sure it’s all good!',
					onPress: handleClaimAccountPress,
				},
			},
		});
	}, []);

	const handleClaimAccountPress = useCallback(async () => {
		try {
			const response = await server.post(CONSTANTS.endpoints.claim(id));
			const aadhar = response.data?.data?.aadhar_number;

			if (aadhar) {
				const res = await server.post(CONSTANTS.endpoints.aadhar_get_otp, { aadhar_number: aadhar });
				if (!res.data?.success) {
					setServerError({ success: false, message: 'Something Went Wrong' });
					return;
				}
				navigation.navigate('AadharOTP', { id, aadhar });
			} else if (response.status === 404) {
				navigation.navigate('ClaimAccount', { id });
			} else if (response.status === 200 && response.data?.success) {
				if (Platform.OS === 'android') {
					ToastAndroid.show(response?.data?.message, ToastAndroid.SHORT);
				} else {
					Alert.alert(
						'Alert',
						response?.data?.message,
						[{ text: 'OK' }],
					);
				}
			} else {
				setServerError({ success: response.status === 200, message: response.data?.message });
			}
		} catch (error) {
			setServerError({ success: false, message: 'An error occurred' });
		}
	}, [id, navigation]);

	return (
		<>
			<View style={styles.notificationContainer}>
				<View style={styles.header}>
					<Text color="regular" weight="regular" size="bodyMid">
						Are you {talentAbout?.first_name} {talentAbout?.last_name}? If not, share it with the right person.
					</Text>
				</View>
				<View style={styles.bodyContainer}>
					<RadioGroup containerStyle={styles.radioButtonContainer} radioButtons={radioButtons} selectedId={selectedId} onPress={handleRadioPress} labelStyle={{ color: theme.colors.muted, fontSize: theme.fontSize.button }} />
				</View>
			</View>
			<View style={styles.footer}>
				{error && (
					<Text color="error" style={{ paddingBottom: theme.padding.sm }}>
						<Asterisk /> {error}
					</Text>
				)}
				<Button onPress={handleKnownPersonAsync} isDisabled={selectedId === ''} style={{ width: '100%' }} type="primary">
					Continue
				</Button>
			</View>
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	notificationContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	header: {
		display: 'flex',
		alignSelf: 'flex-start',
		justifyContent: 'flex-start',
		paddingVertical: theme.padding.xl,
		paddingHorizontal: theme.padding.base,
	},
	bodyContainer: {
		display: 'flex',
		width: '100%',
		gap: theme.gap.xxs,
		textAlign: 'center',
		alignItems: 'center',
	},
	radioButtonContainer: {
		width: '100%',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		display: 'flex',
		width: '100%',
		padding: theme.padding.base,
		marginBottom: theme.margins.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
