import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { TabNavigatorDefaultScreenOptions } from '@components/tabNavigator/TabNavigatorDefaultScreenOptions';
import { useAuth } from './auth/AuthContext';
import { Search as SearchIcon, Home as HomeIcon, Mail, Person, Bookings as BookingsIcon, Receipt, Project, Calendar, Notification } from '@touchblack/icons';

import Home from '@presenters/Home';
import Search from '@presenters/search/Search';
import { blackOrWhite, primaryOrNone, primaryOrWhite } from '@utils/colorUtil';
import Projects from '@presenters/projects/Projects';
import AllConversations from './messages/other-chats/AllConversations';
import StudioHome from './studio/StudioHome';
import Bookings from './studio/Bookings';
import StudioInvoices from './studio/StudioInvoices';
import StudioProfile from './studio/profile/StudioProfile';
import StudioConversationsList from './studio/messages/StudioConversationsList';
import { TouchableOpacity } from 'react-native';
import ProducerCalendarView from './projects/ProducerCalendarView';
import TalentProfile from './talentProfile/TalentProfile';
import TalentProjects from './projects/TalentProjects';
import ManagerProfile from './assignManager/ManagerProfile';
import Notifcations from './Notifications';
import Invoices from './invoices/Invoices';
import ManagerInvoices from './assignManager/ManagerInvoices';
import ManagerChats from './assignManager/ManagerChats';
import useGetManagerTalents from '@network/useGetManagerTalents';

const Tab = createBottomTabNavigator();

function TabNavigator() {
	const { styles } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const isProducerLoggedIn = loginType === 'producer';
	const isStudioLoggedIn = loginType === 'studio';
	const isManagerLoggedIn = loginType === 'manager';
	const { data: managerTalents,  } = useGetManagerTalents('active');

	const producerRoutes = [
		{
			title: 'Home',
			icon: (active: boolean) => <HomeIcon color={primaryOrNone(active)} strokeWidth={3} size={active ? '28' : '24'} strokeColor={blackOrWhite(active)} />,
			component: Home,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Calendar',
			permissions: ['Project::View'],
			icon: (active: boolean) => <Calendar color={'none'} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: ProducerCalendarView,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Search',
			icon: (active: boolean) => <SearchIcon color={primaryOrWhite(active)} size="24" />,
			component: Search,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Projects',
			permissions: ['Project::View'],
			icon: (active: boolean) => <Project color={primaryOrWhite(active)} size="24" strokeWidth={1} />,
			component: Projects,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Messages',
			permissions: ['Messages::View', 'Project::View'],
			icon: (active: boolean) => <Mail color={primaryOrWhite(active)} size="24" />,
			component: AllConversations,
			options: () => ({
				headerShown: false,
			}),
		},
	];

	const routes = [
		{
			title: 'Home',
			icon: (active: boolean) => <HomeIcon color={primaryOrNone(active)} strokeWidth={3} size={active ? '28' : '24'} strokeColor={blackOrWhite(active)} />,
			component: Home,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Calendar',
			icon: (active: boolean) => <Calendar color={'none'} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: TalentProjects,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Search',
			icon: (active: boolean) => <SearchIcon color={primaryOrWhite(active)} size="24" />,
			component: Search,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Messages',
			icon: (active: boolean) => <Mail color={primaryOrWhite(active)} size="24" />,
			component: AllConversations,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Profile',
			icon: (active: boolean) => <Person color={primaryOrWhite(active)} size="32" strokeWidth={1} />,
			component: TalentProfile,
			options: () => ({
				headerShown: false,
			}),
		},
	];

	const studioRoutes = [
		{
			title: 'Home',
			icon: (active: boolean) => <HomeIcon color={primaryOrNone(active)} strokeWidth={3} size={active ? '28' : '24'} strokeColor={blackOrWhite(active)} />,
			component: StudioHome,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Bookings',
			icon: (active: boolean) => <BookingsIcon color="none" size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			permissions: ['Calendar::View'],
			component: Bookings,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Invoices',
			icon: (active: boolean) => <Receipt color={primaryOrWhite(active)} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: StudioInvoices,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Profile',
			icon: (active: boolean) => <Person color={'none'} size="30" strokeWidth={3} stroke={primaryOrWhite(active)} strokeColor={primaryOrWhite(active)} />,
			component: StudioProfile,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Messages',
			icon: (active: boolean) => <Mail color={primaryOrWhite(active)} size="24" />,
			permissions: ['Messages::View'],
			component: StudioConversationsList,
			options: () => ({
				headerShown: false,
			}),
		},
	];

	const shouldDisableTabs = !managerTalents?.data?.manager_talents?.length;

	const managerRoutes = [
		{
			title: 'Calendar',
			icon: (active: boolean) => <Calendar color={'none'} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: TalentProjects,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Messages',
			icon: (active: boolean) => <Mail color={primaryOrWhite(active)} size="24" />,
			component: ManagerChats,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Invoices',
			icon: (active: boolean) => <Receipt color={primaryOrWhite(active)} size="24" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: ManagerInvoices,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Profile',
			icon: (active: boolean) => <Person color={primaryOrWhite(active)} size="32" strokeWidth={1} />,
			component: ManagerProfile,
			options: () => ({
				headerShown: false,
			}),
		},
		{
			title: 'Notifications',
			icon: (active: boolean) => <Notification color={primaryOrNone(active)} size="32" strokeWidth={3} strokeColor={primaryOrWhite(active)} />,
			component: Notifcations,
			options: () => ({
				headerShown: false,
			}),
		},
	].map(route => ({
		...route,
		isDisabled: shouldDisableTabs && route.title !== 'Profile',
	}));
	let initialRouteName = 'Home';
	if (isManagerLoggedIn) {
		initialRouteName = 'Profile';
	} else if (isStudioLoggedIn) {
		initialRouteName = 'Home';
	} else if (isProducerLoggedIn) {
		initialRouteName = 'Home';
	} else {
		initialRouteName = 'Home';
	}

	return (
		<Tab.Navigator screenOptions={TabNavigatorDefaultScreenOptions} initialRouteName={initialRouteName} sceneContainerStyle={styles.sceneContainerStyle}>
			{isStudioLoggedIn
				? studioRoutes.map((routeConfig, index) => {
						const hasPermission = routeConfig?.permissions?.length && permissions ? routeConfig?.permissions?.findIndex(it => JSON.parse(permissions!).includes(it)) !== -1 : true;

						return (
							<Tab.Screen
								key={index}
								name={routeConfig.title}
								component={routeConfig.component}
								options={({ route }) => ({
									...routeConfig.options(),
									tabBarIcon: ({ focused }) => routeConfig.icon(focused),
									tabBarButton: props => (
										<TouchableOpacity
											{...props}
											disabled={!hasPermission} // Disable the button if no permission
											style={[props.style, !hasPermission && { opacity: 0.5 }]} // Style for disabled button
											onPress={() => {
												if (hasPermission) {
													props.onPress();
												}
											}}>
											{props.children}
										</TouchableOpacity>
									),
								})}
							/>
						);
				  })
				: isProducerLoggedIn
				? producerRoutes.map((routeConfig, index) => {
						// Check if the user has the required permission
						const hasPermission = routeConfig?.permissions?.length && permissions ? routeConfig?.permissions?.findIndex(it => JSON.parse(permissions!).includes(it)) !== -1 : true;

						return (
							<Tab.Screen
								key={index}
								name={routeConfig.title}
								component={routeConfig.component}
								options={({ route }) => ({
									...routeConfig.options(),
									tabBarIcon: ({ focused }) => routeConfig.icon(focused),
									tabBarButton: props => (
										<TouchableOpacity
											{...props}
											disabled={!hasPermission} // Disable the button if no permission
											style={[props.style, !hasPermission && { opacity: 0.5 }]} // Style for disabled button
											onPress={() => {
												if (hasPermission) {
													props.onPress();
												}
											}}>
											{props.children}
										</TouchableOpacity>
									),
								})}
							/>
						);
				  })
				: isManagerLoggedIn
				? managerRoutes.map((routeConfig, index) => {
						const hasPermission = routeConfig?.permissions?.length && permissions ? routeConfig?.permissions?.findIndex(it => JSON.parse(permissions!).includes(it)) !== -1 : true;
						return (
							<Tab.Screen
								key={index}
								name={routeConfig.title}
								component={routeConfig.component}
								options={({ route }) => ({
									...routeConfig.options(),
									tabBarIcon: ({ focused }) => routeConfig.icon(focused),
									tabBarButton: props => (
										<TouchableOpacity
											{...props}
											disabled={routeConfig.isDisabled}
											style={[props.style, routeConfig.isDisabled && { opacity: 0.5 }]}
											onPress={() => {
												if (hasPermission) {
													props.onPress();
												}
											}}>
											{props.children}
										</TouchableOpacity>
									),
								})}
							/>
						);
				  })
				: routes.map((routeConfig, index) => {
						const hasPermission = routeConfig?.permissions?.length && permissions ? routeConfig?.permissions?.findIndex(it => JSON.parse(permissions!).includes(it)) !== -1 : true;

						return (
							<Tab.Screen
								key={index}
								name={routeConfig.title}
								component={routeConfig.component}
								options={({ route }) => ({
									...routeConfig.options(),
									tabBarIcon: ({ focused }) => routeConfig.icon(focused),
									tabBarButton: props => (
										<TouchableOpacity
											{...props}
											disabled={!hasPermission} // Disable the button if no permission
											style={[props.style, !hasPermission && { opacity: 0.5 }]} // Style for disabled button
											onPress={() => {
												if (hasPermission) {
													props.onPress();
												}
											}}>
											{props.children}
										</TouchableOpacity>
									),
								})}
							/>
						);
				  })}
		</Tab.Navigator>
	);
}

export default TabNavigator;

const stylesheet = createStyleSheet(theme => ({
	globalHeaderStyle: {
		borderTopColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		height: 50,
	},
	sceneContainerStyle: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
