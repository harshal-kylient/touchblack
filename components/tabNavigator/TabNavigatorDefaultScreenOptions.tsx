import { ParamListBase, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { darkTheme } from '@touchblack/ui/theme';
import { routes } from './HomeTabRoutes';
import { Platform } from 'react-native';

type defaultScreenOptionsType = BottomTabNavigationOptions | ((props: { route: RouteProp<ParamListBase, string>; navigation: any }) => BottomTabNavigationOptions);

export const TabNavigatorDefaultScreenOptions: defaultScreenOptionsType = ({ route, navigation }) => {
	return {
		headerStyle: {
			borderTopColor: darkTheme.colors.borderGray,
			borderWidth: darkTheme.borderWidth.slim,
			backgroundColor: darkTheme.colors.backgroundLightBlack,
			height: 50,
		},
		tabBarShowLabel: true,
		headerTintColor: darkTheme.colors.typography,
		tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
		tabBarLabelStyle: { opacity: navigation.isFocused() ? 1 : 0 },
	tabBarStyle: {
  backgroundColor: darkTheme.colors.black,
  alignItems: 'center',
  paddingVertical: darkTheme.padding.xs,
  ...(Platform.OS === 'android' && {
    paddingBottom: 0,
    height: 55,
  }),
},
		headerShadowVisible: false,
		tabBarActiveTintColor: darkTheme.colors.primary,
		tabBarIcon: ({ focused }) => {
			const currentRoute = routes.find(customRoute => customRoute.title === route.name);
			if (currentRoute) {
				return currentRoute.icon(focused);
			}
			return null;
		},
	};
};
