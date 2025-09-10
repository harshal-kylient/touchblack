import Upcoming from '@components/errors/Upcoming';
import { StatusBar, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { darkTheme } from '@touchblack/ui/theme';

function Calendar() {
	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
		});
	}, [navigation]);

	return (
		<View style={{ flex: 1, backgroundColor: darkTheme.colors.black, justifyContent: 'center' }}>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.black} />
			<Upcoming />
		</View>
	);
}

export default Calendar;
