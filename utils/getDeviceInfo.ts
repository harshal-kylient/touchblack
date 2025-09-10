import { Platform } from 'react-native';
// import { getPersistentIdentifier } from 'rn-unique-identifier';
import server from './axios';
import CONSTANTS from '../constants/constants';
import { AuthStorage } from './storage';
import { getFCMToken, localNotify, onFgMessageReceived, onTokenRefresh, registerDeviceFCM, requestNotificationPermission } from './notify';

export async function getUniqueDeviceId() {
	const deviceId = new Promise(resolve => {
		//getPersistentIdentifier(uuid => {
			const uuid = 'abcd';
			resolve(uuid);
		//});
	});

	return await deviceId;
}

export function getDeviceOS() {
	return Platform.OS[0].toUpperCase() + Platform.OS.slice(1);
}

export async function registerDevice() {
	const device_os = getDeviceOS();
	const unique_device_id = await getUniqueDeviceId();
	onFgMessageReceived(msg => localNotify(msg));
	onTokenRefresh(registerDevice);

	await requestNotificationPermission();
	const registered = await registerDeviceFCM();
	if (!registered) {
		return;
	}
	const push_token = await getFCMToken();

	const response = await server.post(CONSTANTS.endpoints.register_device, { unique_device_id, device_os, push_token });
	if (response.data?.success) {
		AuthStorage.set('device_id', unique_device_id as unknown as string);
		AuthStorage.set('device_registered', true);
	}
}
