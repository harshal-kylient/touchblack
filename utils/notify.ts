import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';

async function requestAndroidNotificationPermission() {
	try {
		await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
	} catch (error) {
		crashlytics().recordError(error as unknown as Error);
	}
}

export async function localNotify(notification: FirebaseMessagingTypes.RemoteMessage) {
	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'Touchblack',
		importance: AndroidImportance.HIGH,
		sound: 'default',
	});

	try {
		await notifee.displayNotification({
			id: notification?.messageId,
			title: notification?.notification?.title,
			body: notification?.notification?.body,
			ios: {
				critical: true,
				sound: 'default',
			},
			data: notification?.data,
			android: {
				channelId,
				importance: AndroidImportance.HIGH,
				smallIcon: 'ic_launcher',
				sound: 'default',
				pressAction: {
					id: notification?.messageId || 'default',
				},
			},
		});
	} catch (err) {
		crashlytics().recordError(err as unknown as Error);
	}
}

export async function checkApplicationPermission() {
	const authorizationStatus = await messaging().requestPermission();

	if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
		crashlytics().log('User has notification permissions enabled.');
	} else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
		crashlytics().log('User has provisional notification permissions.');
	} else {
		crashlytics().log('User has notification permissions disabled');
	}
}

export async function registerDeviceFCM(): Promise<boolean> {
	try {
		if (messaging().isDeviceRegisteredForRemoteMessages) {
			return true;
		}
		await messaging().registerDeviceForRemoteMessages();
		return true;
	} catch (err) {
		crashlytics().recordError(err as unknown as Error);
		return false;
	}
}

export function onTokenRefresh(callback: (e: string) => void): void {
	crashlytics().log('Token Refreshed');
	messaging().onTokenRefresh(callback);
}

export async function getFCMToken(): Promise<string | null> {
	try {
		const token = await messaging().getToken();
		return token;
	} catch (err) {
		crashlytics().recordError(err as unknown as Error);
		return null;
	}
}

export async function requestIOSNotificationPermission() {
	try {
		const authStatus = await messaging().requestPermission();

		const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			crashlytics().log('IOS: Notification Permission Granted. ' + authStatus);
		} else if (authStatus === messaging.AuthorizationStatus.DENIED) {
			crashlytics().log('IOS: Notification permission denied by user');
		}
	} catch (err) {
		crashlytics().recordError(err as unknown as Error);
	}
}

export async function requestNotificationPermission() {
	if (Platform.OS === 'android') {
		await requestAndroidNotificationPermission();
	} else if (Platform.OS === 'ios') {
		await requestIOSNotificationPermission();
	}
}

export async function subscribeToTopic(topic: string) {
	messaging().subscribeToTopic(topic);
}

export function onFgMessageReceived(callback = (msg: FirebaseMessagingTypes.RemoteMessage) => msg) {
	return messaging().onMessage(async remoteMessage => callback(remoteMessage));
}

export async function onBgMessageReceived(callback = (msg: FirebaseMessagingTypes.RemoteMessage) => msg) {
	return messaging().setBackgroundMessageHandler(async remoteMessage => callback(remoteMessage));
}
