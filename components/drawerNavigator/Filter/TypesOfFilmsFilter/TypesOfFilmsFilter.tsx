import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Text } from '@touchblack/ui';
import { Menu } from '@touchblack/icons';

import { IAction, IState } from '../FilterContext';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetFilmTypes from '@network/useGetFilmTypes';
import iconmap from '@utils/iconmap';
import { Dispatch } from 'react';

interface IFilmType {
	black_enum_type: string;
	created_at: string;
	description: string | null;
	extra_data: any | null;
	id: string;
	name: string;
	updated_at: string;
}

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

function TypesOfFilmsFilter({ state, dispatch }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { data: response } = useGetFilmTypes();

	const filmTypes = response?.pages?.flatMap(page => page) || [];

	const handleFilmItemClick = (item: IFilmType) => {
		const isSelected = state?.video_type_id?.some(it => it?.id === item.id);

		if (isSelected) {
			dispatch({ type: 'VIDEO_TYPE_REMOVE', value: item });
		} else {
			dispatch({ type: 'VIDEO_TYPE_ADD', value: item });
		}
	};

	return (
		<Accordion title="Types of Films">
			<ScrollableHorizontalGrid>
				{filmTypes.map(item => {
					const Icon = iconmap(state?.video_type_id?.some(it => it.id === item.id) ? theme.colors.black : theme.colors.typography)[item.name.toLowerCase()] || Menu;
					return (
						<TouchableOpacity key={item?.id} onPress={() => handleFilmItemClick(item)}>
							<View style={[styles.item, state?.video_type_id?.some(it => it.id === item.id) && styles.itemActive, { width: 120, height: 120 }]}>
								<Icon size="48" color={state?.video_type_id?.some(it => it.id === item.id) ? theme.colors.black : theme.colors.typography} strokeColor={state?.video_type_id?.some(it => it.id === item.id) ? theme.colors.black : theme.colors.typography} />
								<Text color={state?.video_type_id?.some(it => it.id === item.id) ? 'black' : 'muted'} textAlign="center" numberOfLines={2} size="bodyMid">
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

export default TypesOfFilmsFilter;

const stylesheet = createStyleSheet(theme => ({
	item: {
		display: 'flex',
		gap: 5,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.padding.xxs,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
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
