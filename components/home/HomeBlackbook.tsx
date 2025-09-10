import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useNavigation } from '@react-navigation/native';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import { FlashList } from '@shopify/flash-list';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import BlackbookUserItem from './BlackbookUserItem';
import useGetBlackbookDataInOrder from '@network/useGetBlackbookDataInOrder';
import { HomeBlackbookEmptyState, HomeBlackbookNoAccess } from '@assets/svgs/errors';
import { Text } from '@touchblack/ui';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

function HomeBlackbook() {
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);
	const { data: response, isLoading } = useGetBlackbookDataInOrder();
	const { permissions, loginType } = useAuth();
	const allowed = loginType === 'producer' ? permissions?.includes('Blackbook::View') : true;
	const data = response?.data || [];

	/*
	 * @params: item -> Blackbook Item
	 * @returns: void
	 */
	const handleItemClick = (item: any) => {
		// navigate to View Blackbook
		navigation.navigate('BlackBookProfile', { item: item });
	};

	return (
		<View style={styles.MostViewedTalentContainer}>
			<LabelWithTouchableIcon label="My favorites" onPress={() => navigation.navigate('Blackbook')} isHidden={!allowed} />
			{isLoading ? (
				<MediumGridPlaceholder />
			) : (
				<View style={styles.itemsContainer}>
					{data?.length ? (
						<FlashList
							bounces={false}
							horizontal
							showsHorizontalScrollIndicator={false}
							data={data}
							renderItem={({ item, index }) => (
								<View style={{ paddingLeft: index === 0 ? theme.padding.base : 0, paddingRight: index === data.length - 1 ? theme.padding.base : 0 }}>
									<BlackbookUserItem item={item} index={index} onPress={() => handleItemClick(item)} />
								</View>
							)}
							estimatedItemSize={180}
							ListEmptyComponent={() => (
								<View style={{ flex: 1, paddingBottom: theme.padding.xxs, width: CONSTANTS.screenWidth, alignItems: 'center' }}>
									<HomeBlackbookEmptyState />
									<Text size="primaryMid" color="regular">
										No Favourite entries yet !
									</Text>
								</View>
							)}
							keyExtractor={(item, index) => item?.user_id || index}
						/>
					) : (
						<View style={{ flex: 1, paddingBottom: theme.padding.xs, paddingTop: theme.padding.xxs, width: CONSTANTS.screenWidth, alignItems: 'center' }}>
							{allowed ? <HomeBlackbookEmptyState /> : <HomeBlackbookNoAccess />}
							<Text size="primaryMid" color="regular">
								{allowed ? 'No Favourite entries yet !' : 'No access to Favourite entries !'}
							</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
}

export default HomeBlackbook;

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
