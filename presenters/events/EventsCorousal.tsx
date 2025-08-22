import React, { useRef, useEffect, useState } from 'react';
import { View, Text, FlatList, ImageBackground, Dimensions, AppState, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import useGetAllEvents from '@network/useAllGetEvents';

const { width } = Dimensions.get('window');
const SLIDE_HEIGHT = 358;
const AUTO_SCROLL_INTERVAL = 5000;
const MANUAL_INTERACTION_DELAY = 5000; 

const FeaturedEventsCarousel = () => {
	const { styles, theme } = useStyles(stylesheet);
	const [currentIndex, setCurrentIndex] = useState(0);
	const flatListRef = useRef<FlatList>(null);
	const timer = useRef<NodeJS.Timeout | null>(null);
	const restartTimer = useRef<NodeJS.Timeout | null>(null); 
	const appState = useRef(AppState.currentState);
	const navigation = useNavigation();

	const { data: response, isLoading } = useGetAllEvents(false);
	const events = response?.pages.flatMap(page => page?.data?.events ?? []) || [];

	const startAutoScroll = () => {
		stopAutoScroll();

		if (!events || events.length === 0) return;

		timer.current = setInterval(() => {
			setCurrentIndex(prevIndex => {
				const nextIndex = (prevIndex + 1) % events.length;

				if (flatListRef.current && events[nextIndex]) {
					flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
				}

				return nextIndex;
			});
		}, AUTO_SCROLL_INTERVAL);
	};

	const stopAutoScroll = () => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = null;
		}
	};

	const clearRestartTimer = () => {
		if (restartTimer.current) {
			clearTimeout(restartTimer.current);
			restartTimer.current = null;
		}
	};

	useEffect(() => {
		if (events.length > 0) {
			startAutoScroll();
		}
		return () => {
			stopAutoScroll();
			clearRestartTimer(); 
		};
	}, [events]);

	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (nextAppState === 'active') {
				startAutoScroll();
			} else {
				stopAutoScroll();
				clearRestartTimer();
			}
			appState.current = nextAppState;
		});

		return () => {
			stopAutoScroll();
			clearRestartTimer(); 
			subscription.remove();
		};
	}, []);

	const handleManualScroll = (index: number) => {
		if (index >= events.length) return;
		stopAutoScroll();
		clearRestartTimer(); 
		setCurrentIndex(index);

		restartTimer.current = setTimeout(() => {
			setCurrentIndex(prevIndex => {
				const nextIndex = (prevIndex + 1) % events.length;
				if (flatListRef.current && events[nextIndex]) {
					flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
				}
				return nextIndex;
			});
			startAutoScroll();
		}, MANUAL_INTERACTION_DELAY);
	};

	if (isLoading) {
		return (
			<View style={[styles.eventsContainer, { height: SLIDE_HEIGHT, justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: theme.colors.muted }}>Loading featured events...</Text>
				<ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 20 }} />
			</View>
		);
	}
	if (events.length === 0) {
		return (
			<View style={[styles.eventsContainer, { paddingVertical:theme.padding.base, justifyContent: 'center', alignItems: 'center' }]}>
				<Text style={{ color: theme.colors.muted }}>No Upcoming events...</Text>
				
			</View>
		);
	}


	return (
		<View style={styles.eventsContainer}>
			<View style={styles.eventsContainerOne}>
				<FlatList
					ref={flatListRef}
					data={events}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					snapToAlignment="start"
					decelerationRate="fast"
					snapToInterval={width}
					onMomentumScrollEnd={e => {
						const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
						handleManualScroll(newIndex);
					}}
					onScrollToIndexFailed={info => {
						const wait = new Promise(resolve => setTimeout(resolve, 500));
						wait.then(() => {
							if (flatListRef.current && events.length > info.index) {
								flatListRef.current.scrollToIndex({ index: info.index, animated: true });
							}
						});
					}}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<View style={styles.slideContainer}>
							<TouchableOpacity onPress={() => navigation.navigate('EventDetails', { event_id: item.id, past_event:false })}>
								<ImageBackground source={item?.poster_url ? { uri: item.poster_url } : require('../../assets/images/loadingImage.png')} style={styles.imageBackground} resizeMode="cover">
									<View style={styles.overlay}>
										<Text style={styles.dateText}>{item?.event_date}</Text>
										<Text style={styles.titleText}>
											{`${item?.title?.length > 30 ? item.title.slice(0, 30) + '...' : item?.title}`} | {item.city}
										</Text>
										<Text style={styles.venueText}>
											Venue: {`${item?.venue_name?.length > 30 ? item.venue.slice(0, 30) + '...' : item?.venue_name}`}, {item.city}
										</Text>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default FeaturedEventsCarousel;

const stylesheet = createStyleSheet(theme => ({
	eventsContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	eventsContainerOne: {
		marginHorizontal: theme.margins.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	slideContainer: {
		width: width,
		height: SLIDE_HEIGHT,
		overflow: 'hidden',
	},
	imageBackground: {
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end',
	},
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.sm,
	},
	dateText: {
		color: theme.colors.primary,
		fontWeight: theme.fontWeight.regular,
		fontSize: theme.fontSize.cardSubHeading,
	},
	titleText: {
		color: theme.colors.typography,
		fontSize: 15,
		marginVertical: theme.margins.xxxs * 1.25,
		fontWeight: theme.fontWeight.bold,
	},
	venueText: {
		color: '#dcdcdc',
		fontSize: theme.fontSize.cardSubHeading,
		fontWeight: theme.fontWeight.regular,
	},
}));
