import { useEffect } from 'react';
import { registerDevice } from './getDeviceInfo';
import { AuthStorage } from './storage';
import analytics from '@react-native-firebase/analytics';
import { getUniqueDeviceId } from './getDeviceInfo';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';

export default function useAppStart() {
	useEffect(() => {
		(async () => {
			await analytics().logEvent('APP_OPEN', { time: new Date().getTime(), device_id: await getUniqueDeviceId() });
			if (AuthStorage.getBoolean('device_registered')) {
				return;
			}

			registerDevice();
		})();

		const unsubscribe = messaging().onNotificationOpenedApp(async remoteMessage => {
			Linking.openURL(String(remoteMessage.data?.redirect_url));
		});

		messaging().onNotificationOpenedApp(remoteMessage => {
			Linking.openURL(remoteMessage.data.redirect_url);
		});

		notifee.onForegroundEvent(async ({ type, detail }) => {
			switch (type) {
				case EventType.DISMISSED:
					break;
				case EventType.PRESS:
					await Linking.openURL(String(detail.notification?.data?.redirect_url));
					break;
			}
		});

		return () => unsubscribe();
	}, []);
}
