import { createDrawerNavigator } from '@react-navigation/drawer';
import { FilterProvider } from '@components/drawerNavigator/Filter/FilterContext';
import Filter from '@components/drawerNavigator/Filter/Filter';
import AddToBlackBook from '@components/drawerNavigator/addToBlackBook/AddToBlackBook';
import MainStackNavigator from './index';
import TabNavigator from './TabNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';
import { useStyles } from 'react-native-unistyles';

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
	const insets = useSafeAreaInsets();
	const { theme} = useStyles()
	const isAndroid = Platform.OS === 'android';

	const insetStyle = isAndroid
		? {
			paddingTop: insets.top * 0.60,
			paddingBottom: insets.bottom*0.85,
			backgroundColor: theme.colors.backgroundDarkBlack,
		  }
		: {};

	return (
		<FilterProvider>
			<View style={[{ flex: 1 }, insetStyle]}>
				<Drawer.Navigator screenOptions={{ headerShown: false, swipeEnabled: false }}>
					<Drawer.Screen name="Main" component={MainStackNavigator} />
					<Drawer.Screen name="Tabs" component={TabNavigator} />
					<Drawer.Screen name="Filter" component={Filter} />
					{/* <Drawer.Screen name="AddToBlackBook" component={AddToBlackBook} /> */}
				</Drawer.Navigator>
			</View>
		</FilterProvider>
	);
}
