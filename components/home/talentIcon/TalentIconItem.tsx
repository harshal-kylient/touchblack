import { Text } from '@touchblack/ui';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import IProfessionDto from '@models/dtos/IProfessionDto';
import iconmap from '@utils/iconmap';
import { Menu } from '@touchblack/icons';

const stylesheet = createStyleSheet(theme => ({
	TalentItem: (lastItem: boolean) => ({
		justifyContent: 'center',
		alignItems: 'center',
		width: 90,
		height: 90,
		padding: theme.padding.xs,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: lastItem ? theme.borderWidth.slim : 0,
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
	}),
	TalentItemActive: {
		backgroundColor: theme.colors.primary,
	},
	textCenter: {
		textAlign: 'center',
		width: 90,
	},
}));

type TalentIconItemsProps = {
	item: IProfessionDto;
	index: number;
	length: number;
	isActive?: boolean;
	onPress: (index: number) => void;
};

function TalentIconItem({ item, index, length, isActive, onPress }: TalentIconItemsProps) {
	const { styles, theme } = useStyles(stylesheet);
	const Icon = iconmap(theme.colors.typography)[item?.name?.toLowerCase()] || Menu;

	return (
		<TouchableOpacity
			style={{
				paddingLeft: index === 0 ? theme.padding.base : 0,
				paddingRight: index === length - 1 ? theme.padding.base : 0,
			}}
			onPress={() => onPress(index)}>
			<View style={[styles.TalentItem(index === length - 1), isActive && styles.TalentItemActive]}>
				<Icon />
				<Text style={styles.textCenter} numberOfLines={1} ellipsizeMode="tail" color={isActive ? 'black' : 'muted'} size="bodyMid">
					{item.name.split(' ')[0]}
				</Text>
				{item.name.split(' ')[1] ? (
					<Text style={styles.textCenter} numberOfLines={1} ellipsizeMode="tail" color={isActive ? 'black' : 'muted'} size="bodyMid">
						{item.name.split(' ').slice(1).join('')}
					</Text>
				) : null}
			</View>
		</TouchableOpacity>
	);
}

export default TalentIconItem;
