import { AuthStorage } from '@utils/storage';

export type AuthState = {
	loginType: string | null | undefined;
	permissions: string | undefined;
	userId: string | null | undefined;
	producerId: string | null | undefined;
	studioId: string | null | undefined;
	studioName: string | null | undefined;
	authToken: string | null | undefined;
	deviceId: string | null | undefined;
	businessOwnerId: string | null | undefined;
	existingInstall: boolean | null | undefined;
	studioOwnerId: string | null | undefined;
	managerTalentId: string | null | undefined;
};

export type AuthAction = { type: 'SET_AUTH_INFO'; payload: Partial<AuthState> } | { type: 'CLEAR_AUTH_STORAGE' };

const initialState: AuthState = {
	loginType: AuthStorage.getString('login_type'),
	permissions: AuthStorage.getString('permissions'),
	userId: AuthStorage.getString('user_id'),
	producerId: AuthStorage.getString('producer_id'),
	studioId: AuthStorage.getString('studio_id'),
	studioName: AuthStorage.getString('studio_name'),
	authToken: AuthStorage.getString('auth_token'),
	deviceId: AuthStorage.getString('device_id'),
	businessOwnerId: AuthStorage.getString('business_owner_id'),
	existingInstall: AuthStorage.getBoolean('existing_install'),
	studioOwnerId: AuthStorage.getString('owner_id'),
	managerTalentId: AuthStorage.getString('manager_talent_id'),
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'SET_AUTH_INFO':
			return { ...state, ...action.payload };
		case 'CLEAR_AUTH_STORAGE':
			AuthStorage.clearAll();
			return {
				loginType: null,
				permissions: '[]',
				userId: null,
				producerId: null,
				studioId: null,
				studioName: null,
				authToken: null,
				deviceId: null,
				businessOwnerId: null,
				existingInstall: true,
				studioOwnerId: null,
				managerTalentId: null,
			};
		default:
			return state;
	}
};

export { initialState, authReducer };
