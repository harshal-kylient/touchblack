import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from 'react-native-unistyles';

import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import SmallGridPlaceholder from '@components/loaders/SmallGridPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import TalentIconItem from './TalentIconItem';
import IProfessionDto from '@models/dtos/IProfessionDto';
import useGetProfessions from '@network/useGetProfessions';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';

export default function ProfessionIconList({ isProducer }: { isProducer: boolean }) {
	const navigation = useNavigation<any>();
	const { theme } = useStyles();
	const { data, isLoading } = useGetProfessions();
	const { dispatch } = useFilterContext();

	const professions = useMemo(() => {
		if (!data?.pages) {
			return [];
		}
		return data.pages.flatMap(page => page).filter(Boolean);
	}, [data]);

	const displayedProfessions = useMemo(() => {
		if (professions.length === 0) {
			return [];
		}
		const sliced = professions.slice(0, 10);
		return professions.length > 4 ? [...sliced, MORE_OBJECT] : sliced;
	}, [professions]);

	const handleTalentItemClick = useCallback(
		async (item: IProfessionDto) => {
			if (item.id === 'more') {
				navigation.navigate('ProfessionsList', { professions });
			} else {
				const profession = item.name;
				dispatch({ type: 'QUERY', value: '' });
				dispatch({ type: 'RESET_FILTERS' });
				dispatch({ type: 'TAB_CHANGE', value: 0 });
				dispatch({ type: 'TALENT_ROLES', value: profession.toLowerCase() });
				navigation.navigate('Search');
			}
		},
		[navigation, professions],
	);

	if (isLoading) {
		return (
			<>
				<TextPlaceholder />
				<SmallGridPlaceholder />
			</>
		);
	}

	return (
		<View style={{ marginTop: !isProducer ? 40 : 0, maxHeight: 108 }}>
			{!isProducer && <LabelWithTouchableIcon onPress={() => navigation.navigate('ProfessionsList', { professions })} label="Talent Type" />}
			<View
				style={{
					borderTopWidth: theme.borderWidth.slim,
					borderBottomWidth: theme.borderWidth.slim,
					borderColor: theme.colors.borderGray,
					marginTop: theme.margins.base,
				}}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{displayedProfessions?.map((item, index) => (
						<TalentIconItem item={item} index={index} length={displayedProfessions.length} onPress={() => handleTalentItemClick(item)} />
					))}
				</ScrollView>
			</View>
		</View>
	);
}

const MORE_OBJECT: IProfessionDto = {
	id: 'more',
	name: 'More',
	black_enum_type: 'Profession',
	created_at: '',
	description: null,
	extra_data: null,
	updated_at: '',
};
