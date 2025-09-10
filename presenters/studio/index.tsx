import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { darkTheme } from '@touchblack/ui/theme';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { SafeAreaView } from 'react-native';
import DiscoverTitlePlaceholder from '@components/loaders/DiscoverTitlePlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import SmallGridPlaceholder from '@components/loaders/SmallGridPlaceholder';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import Home from './Home';

export interface IStudioStackParams extends ParamListBase {
	Home: undefined;
}

const Stack = createNativeStackNavigator<IStudioStackParams>();

const stackNavigatorScreenOptions: NativeStackNavigationOptions = {
	headerTintColor: darkTheme.colors.typography,
	headerTitleStyle: {
		fontFamily: 'CabinetGrotesk-Regular',
		fontSize: darkTheme.fontSize.primaryH2,
	},
	headerStyle: { backgroundColor: darkTheme.colors.backgroundDarkBlack },
	headerShown: false,
	autoHideHomeIndicator: true,
	animation: 'slide_from_right',
};

export default function StudioStackNavigator() {
	const { userId, loginType: userType } = useAuth();
	const { data: talentData, isLoading } = useGetTalentDetails(userId!);
	const firstName = talentData?.data?.first_name;
	const talentRole = talentData?.data?.talent_role;
	const currentScreen = userId && (!firstName || !talentRole) ? 'PersonalDetails' : userType === 'producer' ? 'TabNavigator' : userType === 'talent' ? 'TabNavigator' : AuthStorage.getBoolean('existing_install') ? 'Login' : 'Carousel';

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
				<DiscoverTitlePlaceholder />
				<TextWithIconPlaceholder />
				<SmallGridPlaceholder />
				<TextWithIconPlaceholder />
				<MediumGridPlaceholder />
				<TextWithIconPlaceholder />
				<LargeGridPlaceholder />
				<TextWithIconPlaceholder />
				<SmallGridPlaceholder />
			</SafeAreaView>
		);
	}

	return (
		<Stack.Navigator initialRouteName={currentScreen} screenOptions={stackNavigatorScreenOptions}>
			<Stack.Screen name="Home" component={Home} />
		</Stack.Navigator>
	);
}
