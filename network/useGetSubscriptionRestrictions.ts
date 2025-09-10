import { useMutation } from '@tanstack/react-query';
import server from '@utils/axios';
import endpoints from '../constants/endpoints';
import { Alert, Platform, ToastAndroid } from 'react-native';

const getSubscriptionRestriction = async (screenId: string) => {
	const response = await server.get(endpoints.subscription_restriction(screenId));
	return response.data;
};

export const useGetSubscriptionRestrictions = () => {
	return useMutation({
		mutationFn: (screenId: string) => getSubscriptionRestriction(screenId),
		onError: error => {
			if (Platform.OS === 'android') {
				ToastAndroid.show(error.message, ToastAndroid.SHORT);
			} else {
				Alert.alert('Error', error.message);
			}
		},
	});
};
