import { useMemo, useState, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';
import BookingCard, { BookingData } from './BookingCard';
import { useGetStudioFloorBookings } from '@network/useGetStudioFloorBookings';
import { useStudioContext } from '../StudioContext';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import NoEnquiries from '@components/errors/NoEnquiries';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import NoBookings from '@components/errors/NoBookings';
import CONSTANTS from '@constants/constants';

export const status = ['Enquiries', 'Tentative', 'Confirmed'];

const TABS = [
	{ id: 0, title: status[0], value: 'enquiry' },
	{ id: 1, title: status[1], value: 'tentative' },
	{ id: 2, title: status[2], value: 'confirmed' },
] as const;

type TabType = (typeof TABS)[number]['value'];

function UpcomingBookings() {
	const { styles } = useStyles(stylesheet);
	const [activeTab, setActiveTab] = useState<TabType>(TABS[0].value);
	const { studioFloor } = useStudioContext();
	const {
		data: studioFloorBookings,
		isLoading,
		error,
	} = useGetStudioFloorBookings({
		studio_floor_id: studioFloor?.id,
		activeTab,
	});

	const groupedBookings = useMemo(() => {
		if (!studioFloorBookings?.data) return {};

		return studioFloorBookings.data.reduce((acc, booking) => {
			const date = booking.start_date;
			if (!acc[date]) {
				acc[date] = [];
			}
			acc[date].push(booking);
			return acc;
		}, {});
	}, [studioFloorBookings?.data]);

	const sortedDates = useMemo(() => {
		return Object.keys(groupedBookings).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
	}, [groupedBookings]);

	const handleTabSwitch = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, []);

	const renderTab = useCallback(
		({ id, title, value }: (typeof TABS)[number]) => (
			<Pressable key={id} onPress={() => handleTabSwitch(value)} style={styles.tab(activeTab === value)}>
				<Text size="button" numberOfLines={1} color={activeTab === value ? 'primary' : 'regular'}>
					{title}
				</Text>
				<View style={styles.absoluteContainer(activeTab === value)} />
			</Pressable>
		),
		[activeTab, handleTabSwitch, styles],
	);

	const renderBookingGroup = useCallback(
		({ item }: { item: string }) => {
			const date = new Date(item);
			const isToday = new Date().toDateString() === date.toDateString();
			const dateString = isToday ? 'Today' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

			return (
				<View style={styles.dateGroup}>
					<Text size="bodySm" color="regular" style={styles.dateHeader}>
						{dateString}
					</Text>
					{groupedBookings[item].map((booking: BookingData) => (
						<BookingCard key={booking.id} booking={booking} />
					))}
				</View>
			);
		},
		[groupedBookings, styles],
	);

	if (!studioFloorBookings)
		return (
			<View style={styles.emptyStateContainer}>
				<NoBookings />
			</View>
		);

	return (
		<View style={styles.container}>
			<Text size="secondary" color="regular" style={styles.title}>
				Upcoming Bookings
			</Text>
			{isLoading ? (
				<View style={styles.container}>
					<TextPlaceholder />
					<TabsPlaceholder numberOfTabs={3} />
					<TextWithIconPlaceholder />
					<TextWithIconPlaceholder />
					<TextWithIconPlaceholder />
				</View>
			) : error ? (
				<Text size="secondary" color="regular">
					Error: {error.message}
				</Text>
			) : (
				<View style={styles.body}>
					<View style={styles.tabContainer}>{TABS.map(renderTab)}</View>
					<View style={styles.contentContainer}>
						<FlashList
							data={sortedDates}
							renderItem={renderBookingGroup}
							keyExtractor={item => item}
							estimatedItemSize={150}
							ListEmptyComponent={
								<View style={{ pointerEvents: 'none' }}>
									<NoEnquiries />
								</View>
							}
							ListFooterComponentStyle={{ marginBottom: 1 }}
						/>
					</View>
				</View>
			)}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		marginTop: theme.margins.base,
		gap: theme.gap.xxl,
		flex: 1,
	},
	title: {
		lineHeight: 24,
		paddingHorizontal: theme.padding.base,
	},
	emptyStateContainer: {
		flex: 1,
		height: (5.5 * CONSTANTS.screenHeight) / 10,
		justifyContent: 'center',
	},
	body: {
		flex: 1,
	},
	tabContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingHorizontal: theme.padding.xs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tab: (active: boolean) => ({
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: active ? theme.colors.black : theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: active ? theme.colors.borderGray : theme.colors.transparent,
		paddingVertical: theme.padding.xs,
		position: 'relative',
	}),
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	contentContainer: {
		paddingTop: theme.padding.xxl,
		backgroundColor: theme.colors.black,
		flex: 1,
	},
	dateGroup: {
		marginBottom: theme.margins.lg,
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	dateHeader: {
		marginBottom: theme.margins.sm,
		paddingHorizontal: theme.padding.base,
	},
}));

export default UpcomingBookings;
