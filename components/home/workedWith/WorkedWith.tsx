import { FlatList, Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import useGetWorkedWith from '@network/useGetWorkedWith';
import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import DiscoverListPlaceholder from '@components/loaders/DiscoverListPlaceholder';
import UserItem from '@components/UserItem';
import { Bookmark } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import CONSTANTS from '@constants/constants';
import NotWorkedWith from '@components/errors/NotWorkedWith';

function WorkedWith() {
	const { styles, theme } = useStyles(stylesheet);
	const { data: workedWithList, isLoading } = useGetWorkedWith();
	const talentData = workedWithList?.data?.data ?? [];
	const navigation = useNavigation();

	if (isLoading) {
		return <DiscoverListPlaceholder />;
	}

	return (
		<View style={styles.WorkedWithContainer}>
			<LabelWithTouchableIcon isHidden={true} label="Worked With" />
			<FlatList
				data={talentData}
				renderItem={({ item }) => (
					<UserItem
						key={item.id}
						name={(item.first_name || '') + ' ' + (item.last_name || '')}
						id={item.id}
						profession={item.profession}
						onPress={() => navigation.navigate('TalentProfile', { id: item?.id })}
						image={createAbsoluteImageUri(item.profile_picture_url)}
						cta={
							<Pressable>
								<Bookmark size="24" color={item.is_bookmarked ? theme.colors.primary : theme.colors.transparent} strokeColor={item.is_bookmarked ? theme.colors.primary : theme.colors.typography} strokeWidth={3} />
							</Pressable>
						}
					/>
				)}
				ListEmptyComponent={
					<View style={{ flex: 1, height: (4.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NotWorkedWith />
					</View>
				}
				keyExtractor={item => item.id}
			/>
		</View>
	);
}

export default WorkedWith;

const stylesheet = createStyleSheet(theme => ({
	WorkedWithContainer: {
		display: 'flex',
		backgroundColor: theme.colors.black,
		marginTop: theme.padding.xxxxl,
		gap: theme.gap.sm,
	},
	labelContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		alignSelf: 'flex-start',
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
}));
