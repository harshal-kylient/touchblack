import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Accordion, Text } from '@touchblack/ui';
import { IAction, IState } from '../FilterContext';
import { Radio, RadioFilled } from '@touchblack/icons';
import { Dispatch } from 'react';

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

const options = [
	{ label: 'Verified', value: 'verified' },
	{ label: 'Non-Verified', value: 'non_verified' },
];

function WorkTypeFilter({ state, dispatch }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const selected = state.is_verified;
	const handleSelect = (value: string) => {
		const booleanValue = value === 'verified' ? 'true' : 'false';
		dispatch({ type: 'IS_VERIFIED', value: booleanValue });
	};

	return (
		<Accordion title="Work Type">
			<View style={styles.optionWrapper}>
				{options.map(option => {
					const isSelected = (selected === 'true' && option.value === 'verified') || (selected === 'false' && option.value === 'non_verified');
					return (
						<View key={option.value} style={styles.itemContainer}>
							<Pressable onPress={() => handleSelect(option.value)} style={styles.radioContainer}>
								{isSelected ? <RadioFilled color={theme.colors.primary} size="24" /> : <Radio size="24" color={theme.colors.borderGray} />}
								<Text size="bodyMid" color="regular" style={styles.label}>
									{option.label}
								</Text>
							</Pressable>
						</View>
					);
				})}
			</View>
		</Accordion>
	);
}

export default WorkTypeFilter;

const stylesheet = createStyleSheet(theme => ({
	optionWrapper: {
		marginTop: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.sm,
		paddingBottom: theme.padding.sm,
	},
	itemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.sm,
	},
	radioContainer: {
		marginRight: theme.margins.xs,
		flexDirection:'row',
		alignItems:'center',
	},
	label: {
		opacity: 0.9,
		marginLeft:theme.margins.xxs
	},
}));
