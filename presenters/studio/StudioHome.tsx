import { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, TouchableWithoutFeedback } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import StudioHeading from './components/StudioHeading';
import StudioTitle from './components/StudioTitle';
import RevenueOverview from './components/RevenueOverview';
import ListNewStudioCard from './components/ListNewStudioCard';
import UpcomingBookings from './components/UpcomingBookings';
import { StudioFloor, useStudioContext } from './StudioContext';
import { useGetStudioFloorBookings } from '@network/useGetStudioFloorBookings';
import useGetStudioFloors from '@network/useGetStudioFloors';

function StudioHome() {
	const { styles, theme } = useStyles(stylesheet);
	const { studioFloor, isStudioTitleOpen, setIsStudioTitleOpen } = useStudioContext();
	const { data: studioFloors } = useGetStudioFloors();
	const { data: studioFloorBookings, isLoading: isStudioFloorBookingsLoading } = useGetStudioFloorBookings({ studio_floor_id: studioFloor?.id });
	const [firstTimeUser, setFirstTimeUser] = useState(false);

	useEffect(() => {
		if (studioFloorBookings) {
			if (studioFloorBookings?.data?.length == 0) {
				setFirstTimeUser(true);
			} else {
				setFirstTimeUser(false);
			}
		}
	}, [studioFloorBookings]);

	const handleOutsidePress = useCallback(() => {
		if (isStudioTitleOpen) {
			setIsStudioTitleOpen(false);
		}
	}, [isStudioTitleOpen]);

	return (
		<TouchableWithoutFeedback onPress={handleOutsidePress}>
			<SafeAreaView style={styles.container}>
				<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundLightBlack} />
				<View style={styles.header(studioFloor)}>
					<StudioHeading />
					<StudioTitle dropdownStyle={styles.dropdownStyle} />
				</View>
				<ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.body} contentContainerStyle={styles.bodyContentContainer}>
					{isStudioTitleOpen && <View style={styles.backdropBlur} />}
					{!studioFloors?.length ? (
						<ListNewStudioCard />
					) : (
						<>
							<RevenueOverview />
							<UpcomingBookings />
						</>
					)}
				</ScrollView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundLightBlack,
		// justifyContent: 'space-between',
	},
	header: (studioFloor: StudioFloor | null) => ({
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingLeft: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		zIndex: 9999,

		paddingBottom: studioFloor === null ? 0 : theme.padding.base,
	}),
	body: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		zIndex: 999,
		gap: theme.gap.xxl,
	},
	bodyContentContainer: {
		gap: theme.gap.xxl,
		paddingBottom: theme.padding.xxl,
	},
	backdropBlur: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		zIndex: 9998,
	},
	dropdownStyle: {
		top: 53,
	},
}));

export default StudioHome;
