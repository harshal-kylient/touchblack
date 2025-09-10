/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { AuthProvider } from '@presenters/auth/AuthContext';

function Main() {
	return (
		<AuthProvider>
			<App />
		</AuthProvider>
	);
}

AppRegistry.registerComponent(appName, () => Main);
