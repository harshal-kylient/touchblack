import { AuthState } from '@presenters/auth/authReducer';
import { AuthStorage } from './storage';

const keyMapping: { [key in keyof AuthState]: string } = {
	loginType: 'login_type',
	permissions: 'permissions',
	userId: 'user_id',
	producerId: 'producer_id',
	studioId: 'studio_id',
	studioName: 'studio_name',
	businessOwnerId: 'business_owner_id',
	authToken: 'auth_token',
	deviceId: 'device_id',
	existingInstall: 'existing_install',
	studioOwnerId: 'owner_id',
};

// To be used outside of a component
export function clearStorage() {
	Object.keys(keyMapping).forEach(key => {
		const storageKey = keyMapping[key as keyof AuthState];
		AuthStorage.set(storageKey, '');
	});
}

export const useAuthStorage = (dispatch: React.Dispatch<any>) => {
	const setAuthInfo = (data: Partial<AuthState>) => {
		Object.entries(data).forEach(([key, value]) => {
			const storageKey = keyMapping[key as keyof AuthState];
			if (storageKey && value !== undefined && value !== null) {
				AuthStorage.set(storageKey, value);
			}
		});

		dispatch({ type: 'SET_AUTH_INFO', payload: data });
	};

	const clearAuthStorage = () => {
		AuthStorage.clearAll();
		dispatch({ type: 'CLEAR_AUTH_STORAGE' });
	};

	return { setAuthInfo, clearAuthStorage };
};
