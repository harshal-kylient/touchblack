import { View, Text, Button } from 'react-native';

import { NavigationProp } from '@react-navigation/native';

type RegisterUserScreenProps = {
	navigation: NavigationProp<any>;
};

function RegisterUser({ navigation }: RegisterUserScreenProps) {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Details Screen</Text>
			<Button title="Go to home screen" onPress={() => navigation.navigate('Home')} />
		</View>
	);
}

export default RegisterUser;
