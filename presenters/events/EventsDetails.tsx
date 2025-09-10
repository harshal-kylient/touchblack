import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, TouchableOpacity, View, Text as RNText, Platform, ToastAndroid, Alert, Share } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Share as ShareIcon } from '@touchblack/icons';
import Header from '@components/Header';
import { Button, Text } from '@touchblack/ui';
import { EventDetailsTab } from '@presenters/studio/components/tabs/EventDetailsTab';

import { useState } from 'react';
import useGetEventDetails from '@network/useGetEventDetails';
import { usePostEventInterest } from '@network/usePostEventsInterest';
import { useQueryClient } from '@tanstack/react-query';
import useGetInterestedStatus from '@network/useGetInterestedStatus';
import { usePostOptedOut } from '@network/usePostOptedOut';
import Upcoming from '@components/errors/Upcoming';

const { width } = Dimensions.get('window');

const SLIDE_HEIGHT = 358;

function EventDetails({ route }) {
	const event_id = route.params.event_id;
	const past_event = route.params?.past_event
	const { styles, theme } = useStyles(stylesheet);
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [message, setMessage] = useState('');
	const [activeTab, setActiveTab] = useState(0);
	const { data: eventDetails } = useGetEventDetails(event_id);
	const { data: interestedStatus } = useGetInterestedStatus(event_id);
	const userEventStatus = interestedStatus?.data?.status;
	const { mutate: postEventsInterest } = usePostEventInterest();
	const { mutate: postOptedOut } = usePostOptedOut();
	const shouldTruncate = eventDetails?.about?.length > 230;
	const displayedDescription = showFullDescription || !shouldTruncate ? eventDetails?.about : eventDetails.about.slice(0, 230) + '...';
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const regDeadline = new Date(eventDetails?.registration_deadline);
	regDeadline.setHours(0, 0, 0, 0);
	const isRegistrationClosed = regDeadline < now;
	const isEventFull = eventDetails?.remaining_slots <= 0;
	const queryClient = useQueryClient();
	const handleSharePress = async () => {
		try {
			const platformType = Platform.OS;
			await Share.share({
				message: `Join us at "${eventDetails?.title}" happening on ${eventDetails?.event_date}!\n\nCheck details only on Talent Grid\n\nhttps://ttgd.in/ed/${event_id}`,
				title: `Event: ${eventDetails?.title}`,
			});
		} catch (error: any) {
			if (Platform.OS === 'android') {
				ToastAndroid.show('Failed to share. Please try again.', ToastAndroid.SHORT);
			} else {
				Alert.alert(
					'Error',
					error?.message || 'Failed to share. Please try again.', // Use error.message if available
					[{ text: 'OK' }],
				);
			}
		}
	};

	const handleInterested = (id: string) => {
		if (isEventFull) {
			setMessage('Event Full. No more slots available.');
			setTimeout(() => setMessage(''), 3000);
			return;
		}
		if (isRegistrationClosed) {
			setMessage('Registration closed. Interest submissions are no longer accepted.');
			setTimeout(() => setMessage(''), 3000);
			return;
		}

		setMessage('');
		postEventsInterest(
			{ id },
			{
				onSuccess: data => {
					if (data?.success) {
						queryClient.invalidateQueries({ queryKey: ['useGetInterestedStatus', event_id] });
						queryClient.invalidateQueries({ queryKey: ['useGetEventDetails', event_id] });
					}
				},
				onError: error => {
					setMessage(error.message || 'Something Went Wrong');
				},
			},
		);
	};
	const handleOptOut = (id: string) => {
		if (isRegistrationClosed) {
			setMessage('Registration closed. You can no longer opt out of this event.');
			setTimeout(() => setMessage(''), 3000);
			return;
		}
		setMessage('');
		postOptedOut(
			{ id },
			{
				onSuccess: data => {
					if (data?.success) {
						queryClient.invalidateQueries({ queryKey: ['useGetInterestedStatus', event_id] });
						queryClient.invalidateQueries({ queryKey: ['useGetEventDetails', event_id] });
					}
				},
				onError: error => {
					setMessage(error.message || 'Something Went Wrong');
				},
			},
		);
	};

	{
		!eventDetails && (
			<View style={{ padding: 20 }}>
				<Text size="bodyMid" color="muted">
					Loading event details...
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Header
					name="Event Details"
					children={
						<Pressable onPress={handleSharePress}>
							<ShareIcon size="24" />
						</Pressable>
					}
				/>
				<View style={styles.eventsContainer}>
					<View style={styles.eventsContainerOne}>
						<View style={styles.slideContainer}>
							<Image source={eventDetails?.poster_url ? { uri: eventDetails.poster_url } : require('../../assets/images/loadingImage.png')} style={styles.imageBackground} resizeMode="cover" />
						</View>
					</View>
				</View>
				<View style={styles.highlightCard}>
					<Text size="bodyMid" style={styles.slotsLeft} numberOfLines={1} color="primary">
						{past_event ? 'Event Ended!' : isEventFull ? 'Event Full!' : `${eventDetails?.remaining_slots} slots left!`}
					</Text>
					<Text size="primaryMid" style={{ paddingHorizontal: 4 }} color="regular">
						{eventDetails?.title}
					</Text>
					<Text size="primarySm" style={{ paddingHorizontal: 4, marginVertical: theme.margins.xs }} color="muted">
						{displayedDescription}
						{shouldTruncate && !showFullDescription && (
							<TouchableOpacity onPress={() => setShowFullDescription(true)}>
								<RNText style={styles.readMoreText}> Read more</RNText>
							</TouchableOpacity>
						)}
					</Text>
				</View>
				<View style={{ paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Pressable
						onPress={() => {
							setActiveTab(0);
						}}
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.transparent,
							borderTopWidth: theme.borderWidth.slim,
							borderRightWidth: theme.borderWidth.slim,
							borderLeftWidth: theme.borderWidth.slim,
							borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent,
							paddingVertical: theme.padding.xs,
							position: 'relative',
						}}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
							Details
						</Text>
						<View style={styles.absoluteContainer(activeTab === 0)} />
					</Pressable>
					<Pressable
						onPress={() => {
							setActiveTab(1);
						}}
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.transparent,
							borderTopWidth: theme.borderWidth.slim,
							borderRightWidth: theme.borderWidth.slim,
							borderLeftWidth: theme.borderWidth.slim,
							borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent,
							paddingVertical: theme.padding.xs,
							position: 'relative',
						}}>
						<Text size="button" style={{ paddingHorizontal: 4 }} numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
							Comments
						</Text>
						<View style={styles.absoluteContainer(activeTab === 1)} />
					</Pressable>
				</View>
				{activeTab === 0 && (
					<View style={styles.detailsContainer}>
						<EventDetailsTab floorDetails={eventDetails} />
					</View>
				)}
				{activeTab === 1 && (
					<View style={styles.upcomingContainer}>
						<Upcoming />
					</View>
				)}
			</ScrollView>
			{!past_event && (
				<View style={styles.footer}>
					{message && (
						<Text color="error" size="bodyBig" style={{ paddingVertical: theme.padding.xxs }}>
							{message}
						</Text>
					)}
					{userEventStatus === 'opted_out' || userEventStatus === 'not_interested' ? (
						<Button type="primary" textColor="black" style={[styles.button, styles.secondaryButton]} onPress={() => handleInterested(eventDetails.id)}>
							Interested
						</Button>
					) : (
						<Button type="secondary" textColor="primary" style={[styles.button, styles.secondaryButton]} onPress={() => handleOptOut(eventDetails.id)}>
							Opt-Out
						</Button>
					)}
				</View>
			)}
		</SafeAreaView>
	);
}

export default EventDetails;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
		width: width,
	},
	upcomingContainer: { flex: 1, backgroundColor: theme.colors.black, marginVertical: theme.margins.base * 7.5 },
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	eventsContainer: {
		marginTop: theme.margins.base * 1.5,
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
		height: SLIDE_HEIGHT,
		overflow: 'hidden',
	},
	readMoreText: {
		paddingHorizontal: theme.padding.xxxs * 2,
		color: theme.colors.primary,
		fontSize: theme.fontSize.cardSubHeading,
		textDecorationLine: 'underline',
	},
	imageBackground: {
		width: '100%',
		height: '100%',
		justifyContent: 'flex-end',
	},
	highlightCard: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		padding: theme.padding.base,
	},
	detailTabContainer: {
		paddingHorizontal: theme.padding.xs,
		marginVertical: theme.margins.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	detailTabContainerOne: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		position: 'relative',
	},
	detailsContainer: {
		marginVertical: theme.margins.base * 3,
	},
	footer: {
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	slotsLeft: { paddingHorizontal: 4, paddingVertical: 2, marginVertical: theme.margins.xxxs, marginBottom: theme.margins.xs, backgroundColor: theme.colors.black, width: '25%' },
	button: {},
	secondaryButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.primary,
	},
}));
