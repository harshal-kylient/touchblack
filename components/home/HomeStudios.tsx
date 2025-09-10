import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useNavigation } from '@react-navigation/native';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import { FlashList } from '@shopify/flash-list';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import StudioItem from './StudioItem';
import useGetDiscoverStudios from '@network/useGetDiscoverStudios';
import { useAuth } from '@presenters/auth/AuthContext';
import { HomeTrendingStudioEmptyState } from '@assets/svgs/errors';
import { Text } from '@touchblack/ui';
import CONSTANTS from '@constants/constants';

function HomeStudios() {
	const navigation = useNavigation();
	const { permissions } = useAuth();
	const { styles, theme } = useStyles(stylesheet);
	const { data, isLoading, fetchNextPage, hasNextPage } = useGetDiscoverStudios();

	const handleItemClick = (item: any) => {
		// navigate to studio details page
		navigation.navigate('StudioDetails', {
			id: item?.id,
			shortlist: true,
			studio: item,
		});
	};

	function fetchMoreData() {
		if (!isLoading && hasNextPage) fetchNextPage();
	}

	return (
		<View style={styles.MostViewedTalentContainer}>
			<LabelWithTouchableIcon label="Hire Locations" onPress={() => navigation.navigate('StudioBookingStep1', { direct_studio_booking: true })} isHidden={!permissions?.includes('Project::Edit')} />
			{isLoading ? (
				<MediumGridPlaceholder />
			) : (
				<View style={styles.itemsContainer}>
					<FlashList
						bounces={false}
						horizontal
						showsHorizontalScrollIndicator={false}
						data={data}
						renderItem={({ item, index }) => (
							<View style={{ paddingLeft: index === 0 ? theme.padding.base : 0, paddingRight: index === data?.length - 1 ? theme.padding.base : 0 }}>
								<StudioItem item={item} index={index} onPress={() => handleItemClick(item)} />
							</View>
						)}
						estimatedItemSize={180}
						ListEmptyComponent={
							<View style={{ flex: 1, paddingTop: theme.padding.xxxl, paddingBottom: theme.padding.xs, width: CONSTANTS.screenWidth, alignItems: 'center' }}>
								<HomeTrendingStudioEmptyState />
								<Text size="primaryMid" color="regular">
									No hire locations available !
								</Text>
							</View>
						}
						onEndReached={fetchMoreData}
						keyExtractor={(item, index) => item?.user_id || index}
					/>
				</View>
			)}
		</View>
	);
}

export default HomeStudios;

const stylesheet = createStyleSheet(theme => ({
	MostViewedTalentContainer: {
		gap: theme.gap.sm,
		backgroundColor: theme.colors.black,
		paddingTop: theme.padding.xxxxl,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		alignSelf: 'flex-start',
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
	},
	itemsContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
}));
