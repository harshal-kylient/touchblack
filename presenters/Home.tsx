import { View, ScrollView, StatusBar, ActivityIndicator, FlatList, Linking, TouchableOpacity, Text, Platform,  } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { darkTheme } from '@touchblack/ui/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import queryString from 'query-string';
import Heading from '@components/home/Heading';
import ProducersList from '@components/home/producersList/ProducersList';
import KnowTheApp from '@components/home/knowTheApp/KnowTheApp';
import FilmItem from '@components/FilmItem';
import DiscoverTitlePlaceholder from '@components/loaders/DiscoverTitlePlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import SmallGridPlaceholder from '@components/loaders/SmallGridPlaceholder';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import ProfessionIconList from '@components/home/talentIcon/ProfessionIconList';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import { useAuth } from './auth/AuthContext';
import CONSTANTS from '@constants/constants';
import useGetTrendingFilms from '@network/useGetLatestRelease';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useStudioBookingContext } from './studio/booking/StudioContext';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import useGetProfessions from '@network/useGetProfessions';
import HomeBlackbook from '@components/home/HomeBlackbook';
import HomeStudios from '@components/home/HomeStudios';
import useGetSearchedShowreel from '@network/useGetSearchedShowreel';
import ProjectCount from './ProjectCount';
import HomeProjects from '@components/home/HomeProjects';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useGetSubscriptionCurrentStatus } from '@network/useGetSubscriptionCurrentStatus';
import SubscriptionBanner from '@components/banner/subscriptionBanner';
import { useSubscription } from './subscriptions/subscriptionRestrictionContext';
import AssigmManager from './assignManager/AssignManagerBanner';
import ChangeManagerBanner from './assignManager/ChangeManagerBanner';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import FilmItemWithComment from '@components/FilmItemWithComment';
import LatestReleaseComponent from './latestRelease/LatestRelease';
import { LongArrowUp } from '@touchblack/icons';
import useGetLatestRelease from '@network/useGetLatestRelease';
import FeaturedEventsCarousel from './events/EventsCorousal';
import { Button } from '@touchblack/ui';
import { EventsFilterStorage } from '@utils/storage';
import WhatsNew from './WhatsNew';

function Home() {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType ,userId } = useAuth();
	let isProducer = loginType === 'producer';
	const [cameFromWeb, setCameFromWeb] = useState(false);
	type PaymentStatus = 'success' | 'failed' | null;
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>();
	const { dispatch } = useStudioBookingContext();
	const { dispatch: searchDispatch } = useFilterContext();
	const { data: subsCurrentStatus, refetch } = useGetSubscriptionCurrentStatus();
	const subscriptionStatus = subsCurrentStatus?.data?.subscription_status?.collated_status;
	const subscriptionData = subsCurrentStatus;
	const subscriptionId = subsCurrentStatus?.data?.subscription?.id;
	const { data: response, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetLatestRelease();
	const data = response?.pages.flatMap(page => page?.data) || [];
	const navigation = useNavigation();
	const { data: professionsData  } = useGetProfessions();
	const { refreshRestrictions } = useSubscription();
	const { data: managerStatus } = useGetManagerStatus();
	const managerId = managerStatus?.data?.manager_talent;
	const insets = useSafeAreaInsets();
	// useEffect(() => {
	// 	if (isProducer || !subscriptionStatus) return;
	// 	switch (subscriptionStatus) {
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ACTIVE:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.SubscriptionPopup, data: subscriptionStatus } });
	// 			break;
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.TRIAL_ENDED:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.SubscriptionPopup, data: subscriptionStatus } });
	// 			break;
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ACTIVE:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.RestartSubscriptionPopup, data: subscriptionStatus } });
	// 			break;
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.CANCELLED_ENDED:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.RestartSubscriptionPopup, data: subscriptionStatus } });
	// 			break;
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ACTIVE:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.RenewNowPopup, data: { subscriptionStatus, subscriptionId } } });
	// 			break;
	// 		case CONSTANTS.SUBSCRIPTION_TYPES.GRACE_PERIOD_ENDED:
	// 			SheetManager.show('Drawer', { payload: { sheet: SheetType.RenewNowPopup, data: { subscriptionStatus, subscriptionId } } });
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// }, [subscriptionStatus, isProducer]);

	const scrollViewRef = useRef<ScrollView>(null);
	const [showScrollToTop, setShowScrollToTop] = useState(false);

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const contentHeight = event.nativeEvent.contentSize.height;
		const layoutHeight = event.nativeEvent.layoutMeasurement.height;

		if (offsetY > 1000 && !showScrollToTop) {
			setShowScrollToTop(true);
		} else if (offsetY <= 1000 && showScrollToTop) {
			setShowScrollToTop(false);
		}
		if (
			offsetY + layoutHeight >= contentHeight - 1000 &&
			hasNextPage &&
			!isFetchingNextPage &&
			!isLoading
		) {
			fetchNextPage();
		}
	};

	const scrollToTop = () => {
		scrollViewRef.current?.scrollTo({ y: 0, animated: true });
	};
	const handleEventsPress=()=>{
		navigation.navigate("EventsList")
	
	}
	const handleExploreTalents = () => {
		searchDispatch({ type: 'TAB_CHANGE', value: 0 });
		navigation.navigate('Search');
	};

	useEffect(() => {
		const checkInitialDeepLink = async () => {
			try {
				const initialURL = await Linking.getInitialURL();
				if (initialURL) handleDeepLink({ url: initialURL });
			} catch (error) {
				console.error('Error checking initial deep link:', error);
			}
		};

		const handleDeepLink = (event: { url: string }) => {
			if (event.url.startsWith('talent-grid://')) {
				const parsed = queryString.parseUrl(event.url);
				const status = parsed.query.paymentStatus;
				refreshRestrictions();
				if (status === 'success' || status === 'failed') {
					setPaymentStatus(status as PaymentStatus);
					setCameFromWeb(true);
				}
			}
		};
		const subscription = Linking.addEventListener('url', handleDeepLink);
		checkInitialDeepLink();
		return () => subscription.remove();
	}, []);

	useEffect(() => {
		if (cameFromWeb && paymentStatus) {
			switch (paymentStatus) {
				case 'success':
					SheetManager.show('Drawer', { payload: { sheet: SheetType.SubscriptionConfirmationPopup, data: paymentStatus } });
					break;
				case 'failed':
					SheetManager.show('Drawer', { payload: { sheet: SheetType.SubscriptionConfirmationPopup, data: paymentStatus } });
					break;
			}
			setCameFromWeb(false);
		}
	}, [paymentStatus, cameFromWeb]);


	const professions = useMemo(() => {
		if (!professionsData?.pages) {
			return [];
		}
		return professionsData.pages.flatMap(page => page).filter(Boolean);
	}, [professionsData]);

	useFocusEffect(
		useCallback(() => {
			refetch();
			refreshRestrictions();
			dispatch({ type: 'RESET' });
			searchDispatch({ type: 'QUERY', value: '' });
			searchDispatch({ type: 'RESET_FILTERS' });
			EventsFilterStorage.delete('eventFilters');
		}, [dispatch, searchDispatch]),
	);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loader}>
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
		<SafeAreaView style={{ flex: 1, marginBottom: -insets.bottom, marginTop: Platform.OS === 'android' ? -insets.top * 0.7 : 0, backgroundColor: theme.colors.black }}>
			<View style={{ flex: 1 }}>
				<ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16} style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
					<StatusBar barStyle="light-content" backgroundColor={theme.colors.black} />
					<Heading isProducer={isProducer} />
					{!isProducer && (
						<View style={styles.newEventsContainer}>
							<LabelWithTouchableIcon isHidden label="New Events" />
							<View style={styles.eventsContainer}>
								<FeaturedEventsCarousel />
								<Button textColor="primary" type="secondary" style={styles.button} onPress={() => handleEventsPress()}>
									View All Events
								</Button>
							</View>
						</View>
					)}
					{!isProducer && managerId && <ChangeManagerBanner data={managerId.manager.full_name} />}
					{/* {!isProducer && ['trial_active', 'trial_ended', 'grace_period_active', 'grace_period_ended'].includes(subscriptionStatus) && <SubscriptionBanner data={subscriptionData} subscriptionStatus={subscriptionStatus} subscriptionId={subscriptionId} />} */}
					{isProducer ? <WhatsNew /> : null}
					{isProducer ? <HomeProjects /> : null}
					{isProducer ? (
						<>
							<LabelWithTouchableIcon onPress={() => navigation.navigate('ProfessionsList', { professions })} label="Explore Talents" style={{ marginTop: theme.margins.xxxl }} />
							<ProfessionIconList isProducer={isProducer} />
							<View style={{ borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xs }}>
								<Button onPress={handleExploreTalents} textColor="black" type="primary" style={{ flexGrow: 1, marginHorizontal: theme.margins.sm, borderColor: theme.colors.primary, borderWidth: theme.borderWidth.slim }}>
									Explore talents
								</Button>
							</View>
							<HomeBlackbook />
							{/* <HomeStudios /> */}
						</>
					) : (
						<>
							<LabelWithTouchableIcon isHidden label="Producers" style={{ marginTop: theme.margins.xxxl, marginBottom: theme.margins.base }} />
							<ProducersList />
							<ProjectCount />
							{!managerId && <AssigmManager />}
						</>
					)}

					<View style={styles.mostViewedFilmsContainer}>
						<LatestReleaseComponent data={data} />
					</View>

					{/* {!isProducer && <KnowTheApp />} */}
				</ScrollView>

				{showScrollToTop && (
					<TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop} activeOpacity={0.8}>
						<LongArrowUp size="27.5" color={theme.colors.backgroundLightBlack} />
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

function Loader({ isFetchingNextPage }: { isFetchingNextPage: boolean }) {
	const theme = darkTheme;
	return isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} style={{ width: 200, height: 193, justifyContent: 'center', alignItems: 'center' }} /> : null;
}

export default Home;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.black,
	},
	loader: {
		flex: 1,
	},
	newEventsContainer:{
		marginTop:theme.margins.base*2.5,
	},
	button: {
		flexGrow: 1,
		marginTop: theme.padding.base,
		marginBottom: theme.margins.base,
		marginHorizontal:theme.margins.base,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
	eventsContainer: {
		flex: 1,
		marginTop:theme.margins.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	mostViewedFilmsContainer: {
		flex: 1,
		backgroundColor: theme.colors.black,
		paddingTop: theme.padding.xxxxl,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
		gap: theme.gap.sm,
	},
	filmItemsContainer: {
		width: CONSTANTS.screenWidth,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	scrollToTopButton: {
		position: 'absolute',
		bottom: 24,
		right: 24,
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		zIndex: 100,
	},
}));
