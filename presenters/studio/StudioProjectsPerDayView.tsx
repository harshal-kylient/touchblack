import Header from '@components/Header';
import { Text } from '@touchblack/ui';
import { ActivityIndicator, SafeAreaView, View, ScrollView, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useState, useCallback } from 'react';
import { groupBy } from 'lodash';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import capitalized from '@utils/capitalized';
import { useStudioContext } from './StudioContext';
import useGetAllStudioBookingsByDate from '@network/useGetAllStudioBookingsByDate';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';
import useHandleLogout from '@utils/signout';
import { getStudioCalendarBackgroundColor } from '@utils/calendarColors';

// Studio Booking Item component - matching ProjectItem
const StudioBookingItem = ({ item, index, onPress, color, listLength }) => {
	const { styles } = useStyles(bookingItemStylesheet);

	return (
		<Pressable style={styles.container} onPress={() => onPress(item)}>
			<View style={styles.borderContainer}>
				<View style={styles.iconContainer(index, listLength, color)} />
				<View>
					<Text size="bodyBig" color="regular">
						{capitalized(item.project_name || 'Self Block')}
					</Text>
					<Text size="bodySm" color="muted">
						{item?.producer_name}
					</Text>
				</View>
			</View>
		</Pressable>
	);
};

export default function StudioProjectsPerDayView({ route }) {
	const day = route.params?.day;
	const [dateString, setDateString] = useState(day?.dateString);
	const date = dateString.split('-')[2];
	const month = parseInt(dateString.split('-')[1]);
	const year = parseInt(dateString.split('-')[0]);
	const { studioFloor } = useStudioContext();

	const { styles, theme } = useStyles(stylesheet);
	const { data: response, isLoading } = useGetAllStudioBookingsByDate(studioFloor?.id, dateString);
	const status_code = response?.status;
	const logout = useHandleLogout(false);
	const navigation = useNavigation();
	const { permissions } = useAuth();

	if (status_code == 401) {
		logout();
	}

	const bookings = response?.data || [];

	// Group bookings by status - considering both status and blocked_project_status
	const confirmedBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Confirmed || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus.Confirmed));

	const tentativeBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Tentative || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus.Tentative));

	const enquiryBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Enquiry || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus.Enquiry));

	const completedBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Completed || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus.Completed));

	const notAvailableBookings = bookings.filter(booking => booking.status === EnumStudioStatus['Not available'] || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus['Not available']));

	// Only show as blocked when status is 'blocked' and blocked_project_status is null
	const blockedBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Blocked && !booking.blocked_project_status);

	const cancelledBookings = bookings.filter(booking => booking.status === EnumStudioStatus.Cancelled || (booking.status === EnumStudioStatus.Blocked && booking.blocked_project_status === EnumStudioStatus.Cancelled));

	// Count bookings by status
	const bookingCounts = {
		[EnumStudioStatus.Confirmed]: confirmedBookings.length,
		[EnumStudioStatus.Tentative]: tentativeBookings.length,
		[EnumStudioStatus.Enquiry]: enquiryBookings.length,
		[EnumStudioStatus.Completed]: completedBookings.length,
		[EnumStudioStatus['Not available']]: notAvailableBookings.length,
		[EnumStudioStatus.Blocked]: blockedBookings.length,
		[EnumStudioStatus.Cancelled]: cancelledBookings.length,
	};

	const handleBookingPress = useCallback(
		booking => {
			if (!booking?.conversation_id || !permissions?.includes('Messages::View')) return;

			navigation.navigate('StudioConversation', {
				id: booking?.conversation_id,
				project_name: booking?.project_name,
				party1Id: studioFloor?.id,
				party2Id: booking?.producer_id,
				project_id: booking.project_id,
				name: booking.producer_name,
				receiver_id: booking.producer_id,
			});
		},
		[navigation, studioFloor, permissions],
	);

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.black }}>
				<ActivityIndicator color={theme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Header name={dateString} />
			<ScrollView style={styles.body}>
				<View style={styles.infoContainer}>
					<View style={styles.dateContainer}>
						<Text size="inputLabel" style={styles.dayText}>
							{moment(dateString, 'YYYY-MM-DD').format('dddd')}
						</Text>
						<Text size="primaryBig" style={styles.dateText}>
							{date}.{month < 10 ? `0${month}` : month}
						</Text>
					</View>
					<View style={styles.statusInfoContainer}>
						{Object.entries(bookingCounts)
							.filter(([_, count]) => count > 0)
							.map(([status, count]) => (
								<View key={status} style={styles.statusContainer}>
									<View style={styles.dot(status)} />
									<Text size="bodyBig" color="regular">
										{count} {status}
									</Text>
								</View>
							))}
						{bookings.length === 0 && (
							<View style={styles.statusContainer}>
								<View style={{ width: 10, height: 10, borderRadius: 24, backgroundColor: theme.colors.borderGray }} />
								<Text size="bodyMid" color="muted">
									No Bookings
								</Text>
							</View>
						)}
					</View>
				</View>

				{confirmedBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Confirmed Bookings
						</Text>
						<FlashList data={confirmedBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus.Confirmed)} listLength={confirmedBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `confirmed-${index}`} />
					</View>
				)}

				{tentativeBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Tentative Bookings
						</Text>
						<FlashList data={tentativeBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus.Tentative)} listLength={tentativeBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `tentative-${index}`} />
					</View>
				)}

				{enquiryBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Enquiries
						</Text>
						<FlashList data={enquiryBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus.Enquiry)} listLength={enquiryBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `enquiry-${index}`} />
					</View>
				)}

				{completedBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Completed Bookings
						</Text>
						<FlashList data={completedBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus.Completed)} listLength={completedBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `completed-${index}`} />
					</View>
				)}

				{notAvailableBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Self Block
						</Text>
						<FlashList data={notAvailableBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus['Not available'])} listLength={notAvailableBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `not-available-${index}`} />
					</View>
				)}

				{blockedBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Blocked
						</Text>
						<FlashList data={blockedBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(EnumStudioStatus.Blocked)} listLength={blockedBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `blocked-${index}`} />
					</View>
				)}

				{cancelledBookings.length > 0 && (
					<View>
						<Text size="primaryMid" style={styles.bookingsText} color="regular">
							Cancelled Bookings
						</Text>
						<FlashList data={cancelledBookings} renderItem={({ item, index }) => <StudioBookingItem item={item} index={index} onPress={handleBookingPress} color={getStudioCalendarBackgroundColor(item.blocked_project_status || EnumStudioStatus.Cancelled)} listLength={cancelledBookings.length} />} estimatedItemSize={60} keyExtractor={(_, index) => `cancelled-${index}`} />
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {},
	body: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	dateContainer: {
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.steps,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dayText: {
		color: theme.colors.typography,
		opacity: 0.6,
	},
	dateText: {
		color: theme.colors.typography,
		fontSize: 40,
	},
	statusInfoContainer: {
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.steps,
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	infoContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dot: status => ({
		width: 10,
		height: 10,
		borderRadius: 24,
		backgroundColor: getStudioCalendarBackgroundColor(status),
	}),
	bookingsText: {
		color: theme.colors.typography,
		padding: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));

const bookingItemStylesheet = createStyleSheet(theme => ({
	container: {
		height: 60,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	borderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: theme.gap.base,
		marginHorizontal: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	iconContainer: (index, listLength = 1, color) => ({
		width: 8,
		height: 60,
		backgroundColor: color,
		opacity: 1 - index / listLength,
	}),
}));
