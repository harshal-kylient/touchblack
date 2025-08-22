import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Text } from '@touchblack/ui';

import { useFilterContext } from '../FilterContext';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import getCurrentFilter from '../getCurrentFilter';
import useGetGenres from '@network/useGetGenres';
import iconmap from '@utils/iconmap';
import { Menu } from '@touchblack/icons';

interface IGenre {
	black_enum_type: string;
	created_at: string;
	description: string | null;
	extra_data: any | null;
	id: string;
	name: string;
	updated_at: string;
}

function GenreFilter() {
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useFilterContext();
	const { data: response } = useGetGenres();
	const activeGenres = state[getCurrentFilter(state.activeTab)]?.genre_ids;
	const genres = response?.pages?.flatMap(page => page) || [];

	const handleGenreItemClick = (genre: IGenre) => {
		const exists = activeGenres?.some((it: IGenre) => it.id === genre.id);

		if (exists) {
			dispatch({ type: 'GENRES_REMOVE', value: genre });
		} else {
			dispatch({ type: 'GENRES_ADD', value: genre });
		}
	};

	return (
		<Accordion title="Genre">
			<ScrollableHorizontalGrid rows={2}>
				{genres.map((item: IGenre) => {
					const Icon = iconmap(activeGenres?.some((it: IGenre) => it.id === item.id) ? theme.colors.black : theme.colors.typography)[item.name.toLowerCase()] || Menu;
					return (
						<TouchableOpacity key={item?.id} onPress={() => handleGenreItemClick(item)}>
							<View style={[styles.item, activeGenres?.some((it: IGenre) => it.id === item.id) && styles.itemActive]}>
								<Icon size="24" />
								<Text numberOfLines={1} color={activeGenres?.some((it: IGenre) => it.id === item.id) ? 'black' : 'muted'} size="bodyMid">
									{item?.name}
								</Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default GenreFilter;

const stylesheet = createStyleSheet(theme => ({
	item: {
		display: 'flex',
		gap: 5,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		variants: {
			isActive: {
				true: {
					backgroundColor: theme.colors.primary,
				},
				false: {
					backgroundColor: theme.colors.transparent,
				},
			},
		},
	},
	itemActive: {
		backgroundColor: theme.colors.primary,
	},
}));
