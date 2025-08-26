import { useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, Pressable, Image } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button } from '@touchblack/ui';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import profileFallback from '@assets/images/profileFallback.png';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import capitalized from '@utils/capitalized';
import { useAuth } from './AuthContext';
import { getUniqueDeviceId } from '@utils/getDeviceInfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AccountSelect({ navigation, route }: any) {
	const userData = route?.params.userData;
	const userId = userData?.user_id;
	const producerId = userData?.producer_id;
	const firstName = userData?.first_name;
	const lastName = userData?.last_name;
	const ownerId = userData?.business_owner_id;
	const talentProfilePicture = userData?.user_profile_picture_url;
	const producerName = userData?.producer_name;
	const producerProfilePicture = userData?.producer_profile_picture_url;
	const { setAuthInfo } = useAuth();
	const insets = useSafeAreaInsets();
	const [error, setError] = useState('');
	const [selection, setSelection] = useState<string>('');
	const { styles, theme } = useStyles(stylesheet);

	async function handleSelect() {
		if (!selection) {
			setError('Please select a profile');
			return;
		} else {
			setError('');
		}

		const login_type = selection === producerId ? 'producer' : 'talent';
		const response = await server.get(CONSTANTS.endpoints.switch_profile(login_type));
		const success = response.data?.success;
		const unique_device_id = (await getUniqueDeviceId()) as unknown as string;
		let producerPermissions = [];

		if (selection === producerId) {
			if (userId === ownerId) {
				const res = await server.get(CONSTANTS.endpoints.list_producer_permissions, {
					headers: {
						Authorization: 'Bearer ' + response.data?.data?.token,
					},
				});

				producerPermissions = res.data?.data?.map(it => it?.name);
			} else {
				const res = await server.get(CONSTANTS.endpoints.producer_access_permission_list(userId), {
					headers: {
						Authorization: 'Bearer ' + response.data?.data?.token,
					},
				});

				producerPermissions = res.data?.data?.map(it => it?.name);
			}
		}

		if (success) {
			setAuthInfo({
				loginType: login_type,
				authToken: response.data?.data?.token,
				userId: userData.user_id || '',
				producerId: userData.producer_id || '',
				deviceId: unique_device_id,
				businessOwnerId: userData.business_owner_id || '',
				studioOwnerId: userData.owner_id || '',
				permissions: JSON.stringify(producerPermissions),
			});
			navigation.reset({
				index: 0,
				routes: [{ name: 'TabNavigator' }],
			});
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={{ gap: 40 }}>
				<View style={styles.accountSelectionContainer}>
					<Text style={styles.heading}>Accounts</Text>
					<Text style={styles.paragraph}>Select the Talent Grid account you want to log in to</Text>
				</View>

				<View style={{}}>
					<Pressable key={`account-${userId}`} onPress={() => setSelection(userId!)} style={styles.accountSelectionWrapper(selection, userId!)}>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={talentProfilePicture ? { uri: createAbsoluteImageUri(talentProfilePicture) } : profileFallback} />
						</View>
						<Text style={styles.accountName(selection, userId!)}>
							{capitalized(firstName)} {lastName}
						</Text>
					</Pressable>
					<Pressable key={`account-${producerId}`} onPress={() => setSelection(producerId!)} style={styles.accountSelectionWrapper(selection, producerId!)}>
						<View style={styles.imageContainer}>
							<Image style={styles.image} source={producerProfilePicture ? { uri: createAbsoluteImageUri(producerProfilePicture) } : profileFallback} />
						</View>
						<Text style={styles.accountName(selection, producerId!)}>{capitalized(producerName)}</Text>
					</Pressable>
				</View>
			</View>
			<View>
				<Text style={styles.errorText(error)}>{error}</Text>
				<View style={styles.buttonContainer}>
					<Button onPress={handleSelect}>Continue</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default AccountSelect;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		fontFamily: 'CabinetGrotesk-Regular',
		justifyContent: 'space-between',
		paddingTop: StatusBar.currentHeight || 50,
	},
	paragraph: {
		color: theme.colors.typographyLight,
		fontSize: theme.fontSize.typographyLg,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	heading: {
		fontSize: theme.fontSize.primaryH1,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	accountName: (selection, id) => ({
		fontSize: theme.fontSize.title,
		color: selection === id ? theme.colors.black : theme.colors.typography,
		paddingHorizontal: 16,
	}),
	imageContainer: {
		width: 64,
		height: 64,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	image: { flex: 1, width: 64, height: 64 },
	accountSelectionWrapper: (selection, id) => ({
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: 16,
		backgroundColor: selection === id ? theme.colors.primary : theme.colors.transparent,
	}),
	errorText: error => ({
		color: theme.colors.destructive,
		padding: 10,
		textAlign: 'center',
		fontSize: theme.fontSize.typographyMd,
		fontFamily: 'CabinetGrotesk-Regular',
		display: error ? 'flex' : 'none',
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.destructive,
	}),
	buttonContainer: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderTopWidth: theme.borderWidth.bold,
		borderTopColor: 'white',
	},
	accountSelectionContainer: { gap: theme.gap.base, paddingHorizontal: theme.padding.base },
}));
