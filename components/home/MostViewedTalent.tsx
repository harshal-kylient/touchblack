import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import useGetTrendingTalents from '@network/useGetTrendingTalents';
import ITalentSearch from '@models/dtos/ITalentSearch';
import { useNavigation } from '@react-navigation/native';
import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import { FlashList } from '@shopify/flash-list';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import TalentThumbnailItem from './TalentThumbnailItem';

function MostViewedTalent() {
	const { data: response, isLoading } = useGetTrendingTalents();
	const data = response?.pages.flatMap(page => page?.data) || [];
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);

	const handleTalentItemClick = (talentData: ITalentSearch) => {
		navigation.navigate('TalentProfile', { id: talentData.user_id });
	};

	return (
		<View style={styles.MostViewedTalentContainer}>
			<LabelWithTouchableIcon label="Most Viewed Talent" onPress={() => navigation.navigate('MostViewedTalentList')} />
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
							<View style={{ paddingLeft: index === 0 ? theme.padding.base : 0, paddingRight: index === data.length - 1 ? theme.padding.base : 0 }}>
								<TalentThumbnailItem
									item={item}
									index={index}
									onPress={() => {
										handleTalentItemClick(item);
									}}
								/>
							</View>
						)}
						estimatedItemSize={180}
						keyExtractor={(item, index) => item?.user_id || index}
					/>
				</View>
			)}
		</View>
	);
}

export default MostViewedTalent;

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
