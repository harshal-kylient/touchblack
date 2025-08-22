import { AuthState, authReducer, initialState } from './authReducer';
import { AuthStorage } from '@utils/storage';
import { useAuthStorage } from '@utils/useAuthStorage';
import { createContext, useContext, useEffect, ReactNode, useReducer } from 'react';

type AuthContextType = AuthState & {
	setAuthInfo: (data: Partial<AuthState>) => void;
	clearAuthStorage: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [authState, dispatch] = useReducer(authReducer, initialState);
	const { setAuthInfo, clearAuthStorage } = useAuthStorage(dispatch);

	useEffect(() => {
		const updateAuthState = () => {
			dispatch({
				type: 'SET_AUTH_INFO',
				payload: {
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
				},
			});
		};

		const listener = AuthStorage.addOnValueChangedListener(updateAuthState);
		return () => listener.remove();
	}, []);

	return <AuthContext.Provider value={{ ...authState, setAuthInfo, clearAuthStorage }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export default AuthContext;
