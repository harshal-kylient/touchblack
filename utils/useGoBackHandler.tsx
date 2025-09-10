import { ParamListBase, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DependencyList, useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useGoBackHandler<ParamList extends ParamListBase, RouteName extends keyof ParamList & string>(onGoBackCallback: () => boolean | null | undefined, deps?: DependencyList) {
	const navigation = useNavigation<StackNavigationProp<ParamList, RouteName>>();

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', onGoBackCallback);
		navigation.addListener('gestureEnd', onGoBackCallback);

		return () => {
			BackHandler.removeEventListener('hardwareBackPress', onGoBackCallback);
			navigation.removeListener('gestureEnd', onGoBackCallback);
		};
	}, [navigation, onGoBackCallback, deps]);
}
