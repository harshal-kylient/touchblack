import { useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';
import { useNavigation } from '@react-navigation/native';

import { Text, Button, RadioGroup } from '@touchblack/ui';
import { useQueryClient } from '@tanstack/react-query';

import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import useGetTalentDetails from '@network/useGetTalentDetails';
import useGetProducerDetails from '@network/useGetProducerDetails';

export type SwitchProfileSheetProps = {
	data?: any;
};

export default function SwitchProfileSheet() {
	const navigation = useNavigation();
	const { userId, producerId, loginType, businessOwnerId, setAuthInfo } = useAuth();
	const { data: talentData } = useGetTalentDetails(userId!);
	const { data: producerData } = useGetProducerDetails(producerId!);
	const firstName = talentData?.data?.first_name;
	const lastName = talentData?.data?.last_name;
	const producerName = producerData?.data?.name;

	const [loading, setLoading] = useState<boolean>(false);
	const radioButtons = [
		{ id: userId, label: capitalized(`${firstName || ''} ${lastName || ''}`) },
		{ id: producerId, label: producerName },
	];
	const [selectedId, setSelectedId] = useState<string | undefined>(loginType === 'talent' ? userId! : producerId!);
	const queryClient = useQueryClient();

	const handleRadioPress = (id: string) => {
		setSelectedId(id);
	};

	const handleProfileSwitch = async () => {
		setLoading(true);
		try {
			const profileType = selectedId === userId ? 'talent' : 'producer';
			const response = await server.get(CONSTANTS.endpoints.switch_profile(profileType));
			if (response.data?.success) {
				let producerPermissions = [];

				if (profileType === 'producer') {
					if (userId === businessOwnerId) {
						const res = await server.get(CONSTANTS.endpoints.list_producer_permissions, {
							headers: {
								Authorization: 'Bearer ' + response.data?.data?.token,
							},
						});

						producerPermissions = res.data?.data?.map(it => it?.name);
					} else {
						const res = await server.get(CONSTANTS.endpoints.producer_access_permission_list(userId!), {
							headers: {
								Authorization: 'Bearer ' + response.data?.data?.token,
							},
						});

						producerPermissions = res.data?.data?.map(it => it?.name);
					}
				}

				setAuthInfo({
					userId: userId || '',
					authToken: response.data.data.token,
					loginType: profileType,
					producerId: producerId || '',

					businessOwnerId: businessOwnerId || '',
					permissions: JSON.stringify(producerPermissions),
				});

				queryClient.invalidateQueries({ queryKey: ['useGetBlackBookProfessions'] });
				queryClient.invalidateQueries({ queryKey: ['useGetArchivedBlackBookList'] });
				queryClient.invalidateQueries({ queryKey: ['useGetBlackBookTalentsByProfession'] });
				queryClient.invalidateQueries({ queryKey: ['useGetWorkedWith'] });
				queryClient.invalidateQueries({ queryKey: ['useGetCrewList'] });
				SheetManager.hide('Drawer');
				navigation.navigate('TabNavigator', { screen: 'Home' });

			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const { styles, theme } = useStyles(stylesheet);

	return (
		<>
			<View style={styles.notificationContainer}>
				<View style={styles.header}>
					<Text color="regular" weight="regular" size="primaryMid">
						Switch Profile
					</Text>
				</View>
				<View style={styles.bodyContainer}>
					<RadioGroup containerStyle={styles.radioButtonContainer} radioButtons={radioButtons} selectedId={selectedId} onPress={handleRadioPress} labelStyle={{ color: theme.colors.muted, fontSize: theme.fontSize.button }} />
				</View>
			</View>
			<View style={styles.footer}>
				<Button onPress={handleProfileSwitch} style={{ width: '100%' }} type="primary">
					{loading ? 'Switching...' : 'Confirm'}
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
		marginBottom:theme.margins.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
