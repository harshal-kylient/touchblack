import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';

const useWelcomeLogic = () => {
	const { studioName } = useAuth();
	const navigation = useNavigation();
	const handleButtonPress = useCallback(() => {
		navigation.navigate('TabNavigator');
	}, [navigation]);

	return { studioName, handleButtonPress };
};

export default useWelcomeLogic;
