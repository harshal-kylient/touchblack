import { Dispatch, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Text } from '@touchblack/ui';

import { IAction, IState } from '../FilterContext';
import SearchInput from '@components/SearchInput';
import useGetIndustries from '@network/useGetIndustries';
import { CheckBox, CheckBoxFilled } from '@touchblack/icons';

interface IIndustry {
	black_enum_type: string;
	created_at: string;
	description: string | null;
	extra_data: any | null;
	id: string;
	name: string;
	updated_at: string;
}

interface IProps {
	state: IState;
	dispatch: Dispatch<IAction>;
}

function IndustryFilter({ state, dispatch }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState('');
	const { data: response } = useGetIndustries();

	const industries = response?.pages?.flatMap(page => page) || [];
	const filteredIndustries = industries.filter((industry: IIndustry) => industry?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()));

	const handleRadioPress = (industry: IIndustry) => {
		const isSelected = state.industry_id.some((it: IIndustry) => it.id === industry.id);
		if (isSelected) {
			dispatch({ type: 'INDUSTRIES_REMOVE', value: industry });
		} else {
			dispatch({ type: 'INDUSTRIES_ADD', value: industry });
		}
	};

	return (
		<Accordion title="Industry">
			<SearchInput placeholderText="Industry" containerStyles={styles.searchInput} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
				<FlatList
					data={filteredIndustries}
					contentContainerStyle={{ maxHeight: (49 + 0.4) * 4, flexWrap: 'wrap', paddingRight: theme.padding.base, paddingLeft: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, marginTop: theme.margins.base }}
					renderItem={({ item: industry }) => (
						<View key={industry.id} style={styles.itemContainer}>
							<Pressable key={industry.id} onPress={() => handleRadioPress(industry)} style={styles.checkbox}>
								{state.industry_id.some(it => it.id === industry.id) ? <CheckBoxFilled size="24" color={theme.colors.primary} /> : <CheckBox size="24" color={theme.colors.muted} />}
							</Pressable>
							<Text size="bodyMid" color="regular" numberOfLines={1} style={{ opacity: 0.8, maxWidth: 300 - 24 - 24 }}>
								{industry.name}
							</Text>
						</View>
					)}
				/>
			</ScrollView>
		</Accordion>
	);
}

export default IndustryFilter;

const stylesheet = createStyleSheet(theme => ({
	itemContainer: {
		flexDirection: 'row',
		gap: theme.gap.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		paddingHorizontal: theme.padding.xs,
	},
	checkbox: {
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.xxs,
	},
	searchInput: {
		marginBottom: 0,
	},
	industryItemContainer: (selectedIds, industry) => ({
		borderColor: selectedIds.includes(industry.id) ? theme.colors.primary : theme.colors.borderGray,
		borderWidth: 2,
		width: 17,
		height: 17,
		justifyContent: 'center',
		alignItems: 'center',
	}),
	svgContainer: {
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		width: 17,
		height: 17,
	},
}));
