import { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import ITalentSearch from '@models/dtos/ITalentSearch';
import SearchInput from '@components/SearchInput';
import UserItem from '@components/UserItem';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import formatName from '@utils/formatName';

type ITalentListByProfessionProps = {
	data: ITalentSearch[];
	heading: string;
};

function TalentListByProfessionBody({ data, heading }: ITalentListByProfessionProps) {
	const { styles } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const navigation = useNavigation();

	function handleTalentRedirect(talentId: string) {
		navigation.navigate('TalentProfile', { id: talentId });
	}

	const filteredData = data?.filter(item => item.first_name?.toLowerCase().includes(searchQuery?.toLowerCase()) || item.last_name?.toLowerCase().includes(searchQuery?.toLowerCase()));

	return (
		<View style={styles.container}>
			<SearchInput placeholderText={`Search ${heading}...`} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<ScrollView style={styles.scrollContainer}>
				{filteredData?.map(item => {
					return <UserItem id={item.id} personIcon name={formatName(item?.first_name, item?.last_name)} image={createAbsoluteImageUri(item?.profile_picture_url)} profession={item?.profession_type} onPress={() => handleTalentRedirect(item?.id)} />;
				})}
			</ScrollView>
		</View>
	);
}

export default TalentListByProfessionBody;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	scrollContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	searchInput: {
		marginBottom: 24,
	},
	basePadding: {
		padding: theme.padding.base,
	},
	itemContainer: {
		flexDirection: 'row',
		width: '100%',
		paddingLeft: theme.padding.base,
		alignItems: 'center',
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
	},
	iconContainer: {
		padding: theme.padding.base,
		borderColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
	},
	imageContainer: {
		width: 64,
		height: 64,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	listImage: {
		width: '100%',
		height: '100%',
	},
	listItemContainer: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
	},
	producersListContainer: {
		marginBottom: 130,
	},
}));
