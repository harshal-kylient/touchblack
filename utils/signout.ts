import CONSTANTS from '@constants/constants';
import server from './axios';
import analytics from '@react-native-firebase/analytics';
import { useAuth } from '@presenters/auth/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useStudioContext } from '@presenters/studio/StudioContext';
import { StudioStorage } from './storage';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';
import { AuthStorage, TalentManagerStorage } from './storage';
import { useQueryClient } from '@tanstack/react-query';

export default function useHandleLogout(navigateToSignin: boolean = false) {
	const { deviceId, setAuthInfo } = useAuth();
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const { resetStudioContext } = useStudioContext();
	const { resetTalentContext } = useTalentContext();

	return async () => {
		try {
			const { data } = await server.post(CONSTANTS.endpoints.signout(deviceId!));

			if (data?.success) {
				setAuthInfo({
					producerId: '',
					loginType: '',
					permissions: '[]',
					userId: '',
					authToken: '',
					studioId: '',
					studioName: '',
					businessOwnerId: '',
					existingInstall: true,
				});
				StudioStorage.clearAll();
				resetTalentContext();
				TalentManagerStorage.clearAll();
				resetStudioContext();
				queryClient.clear();
				navigation.reset({
					index: 0,
					routes: [{ name: navigateToSignin ? 'Login' : 'SessionExpired' }],
				});

				await analytics().logEvent('LOGOUT_SUCCESS', { time: Date.now() });
			}
		} catch (error) {
			await analytics().logEvent('LOGOUT_ERROR', { time: Date.now(), error: error.toString() });
		}
	};
}
