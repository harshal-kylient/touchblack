import { View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { useStyles } from 'react-native-unistyles';

const LoadingScreen = () => {
	const { theme } = useStyles();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<ActivityIndicator size="large" color="white" />
				<Text style={{ color: 'white', marginTop: theme.margins.base, fontSize: 12 }}>you are being redirected to talent grid</Text>
			</View>
		</SafeAreaView>
	);
};

export default LoadingScreen;
