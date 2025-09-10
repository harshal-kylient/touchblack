import { useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Text } from '@touchblack/ui';

import SearchInput from '@components/SearchInput';
import IProfessionDto from '@models/dtos/IProfessionDto';
import { useFilterContext } from '../FilterContext';
import useGetProfessions from '@network/useGetProfessions';
import getCurrentFilter from '../getCurrentFilter';
import { Radio, RadioFilled } from '@touchblack/icons';

function TalentRoleFilter() {
	const { styles, theme } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState('');
	const { data: response } = useGetProfessions();
	const { state, dispatch } = useFilterContext();

	const professions = response?.pages?.flatMap(page => page) || [];
	const filteredProfessions = professions.filter(profession => profession?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleRadioPress = (profession: IProfessionDto) => {
		dispatch({ type: 'TALENT_ROLES', value: profession.name.toLowerCase() });
	};

	return (
		<Accordion title={`Talent Role (${professions?.length})`}>
			<SearchInput searchQuery={searchQuery} containerStyles={styles.searchInput} setSearchQuery={setSearchQuery} placeholderText="Search professions..." />
			<ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
				<FlatList
					data={filteredProfessions}
					contentContainerStyle={{ maxHeight: (49 + 0.4) * 4, flexWrap: 'wrap', paddingRight: theme.padding.base, paddingLeft: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, marginTop: theme.margins.base }}
					renderItem={({ item: profession }) => (
						<View key={profession.id} style={styles.itemContainer}>
							<Pressable onPress={() => handleRadioPress(profession)} style={styles.professionItemContainer}>
								{state[getCurrentFilter(state.activeTab)].profession_type === profession.name.toLowerCase() ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
							</Pressable>
							<Text size="bodyMid" color="regular" numberOfLines={1} style={{ opacity: 0.8, maxWidth: 220 - 24 - 24 }}>
								{profession.name}
							</Text>
						</View>
					)}
				/>
			</ScrollView>
		</Accordion>
	);
}

export default TalentRoleFilter;

const stylesheet = createStyleSheet(theme => ({
	itemContainer: {
		flexDirection: 'row',
		gap: theme.gap.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		width: 220,
		alignItems: 'center',
	},
	searchInput: {
		marginBottom: 0,
	},
	professionItemContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xxs,
	},
}));
