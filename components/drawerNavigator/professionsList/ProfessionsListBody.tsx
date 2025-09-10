import { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@touchblack/ui';
import { Menu } from '@touchblack/icons';

import SearchInput from '@components/SearchInput';
import IProfessionDto from '@models/dtos/IProfessionDto';
import iconmap from '@utils/iconmap';
import { FlashList } from '@shopify/flash-list';
import { useFilterContext } from '../Filter/FilterContext';

type ProfessionsListBodyProps = {
	data: IProfessionDto[];
};

function ProfessionsListBody({ data }: ProfessionsListBodyProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const navigation = useNavigation();
	const { dispatch } = useFilterContext();

	const filteredData = data?.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

	function handleKeyPress(profession_type: string) {
		dispatch({ type: 'QUERY', value: '' });
		dispatch({ type: 'RESET_FILTERS' });
		dispatch({ type: 'TAB_CHANGE', value: 0 });
		dispatch({ type: 'TALENT_ROLES', value: profession_type.toLowerCase() });
		navigation.navigate('TabNavigator', {
			screen: 'Search',
		});
	  
	}

	return (
		<View style={styles.container}>
			<SearchInput placeholderText={`Search ${searchQuery}...`} searchQuery={searchQuery} setSearchQuery={setSearchQuery} containerStyles={styles.searchInput} />
			<FlashList
				data={filteredData}
				renderItem={({ item, index }) => {
					const Icon = iconmap(theme.colors.typography)[item?.name?.toLowerCase()] || Menu;
					return (
						<Pressable onPress={() => handleKeyPress(item.name)} style={styles.itemContainer(index)}>
							<View style={styles.iconContainer}>
								<Icon />
							</View>
							<Text style={styles.itemText} size="bodyBig" color="regular">
								{item.name}
							</Text>
						</Pressable>
					);
				}}
				estimatedItemSize={50}
				contentContainerStyle={{
					paddingBottom: theme.padding.xxl,
				}}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

export default ProfessionsListBody;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	searchInput: {
		marginBottom: 24,
	},
	itemContainer: (index: number) => ({
		flexDirection: 'row',
		width: '100%',
		paddingLeft: theme.padding.base,
		alignItems: 'center',
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: index === 0 ? theme.borderWidth.slim : 0,
	}),
	iconContainer: {
		padding: theme.padding.xs,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		opacity: 0.8,
	},
	itemText: { padding: theme.padding.base, opacity: 0.6 },
}));
