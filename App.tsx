import { useEffect, useState } from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { MenuProvider } from 'react-native-popup-menu';
import RNRestart from 'react-native-restart';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SheetManager, SheetProvider } from 'react-native-actions-sheet';
import SplashScreen from 'react-native-splash-screen';

import { Button } from '@touchblack/ui';
import { SWRConfig } from 'swr';
import { darkTheme } from '@touchblack/ui/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './unistyles';
import useAppStart from '@utils/useAppStart';
import { FilterProvider } from '@components/drawerNavigator/Filter/FilterContext';
import { ProjectProvider } from '@presenters/projects/ProjectContext';
import { useAuth } from '@presenters/auth/AuthContext';
import fetcher from '@utils/fetcher';
import { MessagesProvider } from '@presenters/messages/MessagesContext';
import NoInternet from '@components/errors/NoInternet';
import { InvoicesProvider } from '@presenters/invoices/context/InvoicesContext';
import ErrorBoundary from 'react-native-error-boundary';
import SomethingWentWrong from '@components/errors/SomethingWentWrong';
import { ShowreelFilterProvider } from '@presenters/talentProfile/Tabs/FilterContext';
import { StudioProvider } from '@presenters/studio/StudioContext';
import { StudioBookingContextProvider } from '@presenters/studio/booking/StudioContext';
import { server } from './utils';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { ProducerFilmsFilterProvider } from '@presenters/producerProfile/Tabs/FilterContext';
import { DrawerNavigator } from '@presenters/DrawerNavigator';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { StudioConversationProvider } from '@presenters/messages/project-chats/useStudioConversationContext';
import { SubscriptionProvider } from '@presenters/subscriptions/subscriptionRestrictionContext';
import { ManagerTalentProvider } from '@presenters/assignManager/ManagerTalentContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
	useAppStart();
	const { styles } = useStyles(stylesheet);
	const [isOffline, setIsOffline] = useState(false);
	const { loginType, studioId, userId, studioOwnerId, businessOwnerId, setAuthInfo } = useAuth();

	useEffect(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: '',
					text: '',
				},
			},
		});

		/*localNotify(
			{
				messageId: 'abcd',
				notification: {
					"body": "Sorry! This location is unavailable for IOP. Do check the studio calendar or look at any of the 150 locations available on your dates.",
					"title": "Testing studio floor 1 is Not Available!"
				},
				fcmOptions: {

				}
			}
		);*/

		(async () => {
			if (loginType === 'producer' && businessOwnerId !== userId) {
				const res2 = await server.get(CONSTANTS.endpoints.fetch_producer_permissions(userId!));
				const permissions = res2.data?.data?.map(it => it.name);
				setAuthInfo({
					permissions: JSON.stringify(permissions),
				});
			} else if (loginType === 'studio' && studioOwnerId !== userId) {
				const res2 = await server.get(CONSTANTS.endpoints.studio_talent_permission(studioId!, userId!));
				const permissions = res2.data?.data?.map(it => it.name);
				setAuthInfo({
					permissions: JSON.stringify(permissions),
				});
			}
		})();

		SplashScreen.hide();
		const removeNetInfoSubscription = NetInfo.addEventListener((state: NetInfoState) => {
			const offline = !state.isConnected && state.isInternetReachable === false;
			setIsOffline(offline);
		});

		return () => removeNetInfoSubscription();
	}, []);

	function onReload() {
		RNRestart.Restart();
	}

	const linking = {
		prefixes: ['talent-grid://', 'ttgd.in', 'https://ttgd.in'],
		config: {
			screens: {
				Tabs: {
					path: 'tabs',
					screens: {
						Home: 'home',
					},
				},
				Main: {
					path: '',
					screens: {
						TalentProfile: 't/:id',
						ProducerProfile: 'p/:id',
						VideoPlayer: 'video/:id',
						EventDetails:'ed/:event_id',
						// ProjectDetails: 'project/:project_id',
						ProjectDetails: 'project-details/:project_id/studio',
						ProjectDetailsView: 'project-details/:project_id',
						// Chat: 'chat/:id/:project_id',
						ProjectConversation: 'project-chat/:id/:project_id',
						StudioProfile: 'studio-details/:id/teams',
						// StudioProfile: 'studio-details/:id',
						RaiseClaim: 'project-completed/:id/:project_id',
						StudioConversation: 'studio-chat/:id/:project_id',
						Bookings: 'studio-projects', // StudioBookings, /studio/bookings.tsx
						UserDetails: 'user/:id',
						LoaderScreen: 'loader/:id',
						Subscriptions: 'subscription-details',
					},
				},
			},
		},
	};

	if (isOffline) {
		return (
			<SafeAreaView style={styles.container}>
				<NoInternet />
				<View style={styles.reloadContainer}>
					<Button onPress={onReload}>Reload</Button>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<ErrorBoundary
			FallbackComponent={() => (
				<SafeAreaView style={styles.container}>
					<SomethingWentWrong />
					<View style={styles.reloadContainer}>
						<Button onPress={onReload}>Reload</Button>
					</View>
				</SafeAreaView>
			)}>
			<SWRConfig value={{ fetcher }}>
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView style={styles.flex}>
						<MenuProvider>
							<ShowreelFilterProvider>
								<ProducerFilmsFilterProvider>
									<FilterProvider defaultFilter="TalentRole">
										<InvoicesProvider>
											<StudioConversationProvider>
												<SubscriptionProvider>
													<ProjectProvider>
														<StudioBookingContextProvider>
															<StudioProvider>
																<MessagesProvider>
																	<ManagerTalentProvider>
																		<SafeAreaProvider>
																			<NavigationContainer linking={linking}>
																				<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
																				<SheetProvider>
																					<DrawerNavigator />
																				</SheetProvider>
																			</NavigationContainer>
																		</SafeAreaProvider>
																	</ManagerTalentProvider>
																</MessagesProvider>
															</StudioProvider>
														</StudioBookingContextProvider>
													</ProjectProvider>
												</SubscriptionProvider>
											</StudioConversationProvider>
										</InvoicesProvider>
									</FilterProvider>
								</ProducerFilmsFilterProvider>
							</ShowreelFilterProvider>
						</MenuProvider>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</SWRConfig>
		</ErrorBoundary>
	);
}

export default App;

const stylesheet = createStyleSheet(theme => ({
	container: { flex: 1, justifyContent: 'center', backgroundColor: darkTheme.colors.backgroundDarkBlack },
	reloadContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 2 * 16, paddingTop: 16, borderTopWidth: 1, borderColor: 'gray' },
	flex: { flex: 1 },
}));
