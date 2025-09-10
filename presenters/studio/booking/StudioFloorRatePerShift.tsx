import { View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { Accordion, Text, TextInput } from '@touchblack/ui';

import { IAction, IState } from './StudioContext';
import CustomMarker from './CustomMarker';
import CONSTANTS from '@constants/constants';
import { Dispatch } from 'react';
import { formatAmount } from '@utils/formatCurrency';

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

export default function StudioFloorRatePerShiftFilter({ state, dispatch }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const values = [state?.filters?.studio_charges_per_shift?.[0], state?.filters?.studio_charges_per_shift?.[1]];

	const handleSliderChange = (value: number[]) => {
		dispatch({ type: 'STUDIO_PER_SHIFT_CHARGE_FILTER', value });
	};

	const handleMinInputChange = (text: string) => {
		const value = parseInt(text) || 0;
		dispatch({ type: 'STUDIO_PER_SHIFT_CHARGE_FILTER', value: [value, values?.[1]] });
	};

	const handleMaxInputChange = (text: string) => {
		const value = parseInt(text) || 0;
		dispatch({ type: 'STUDIO_PER_SHIFT_CHARGE_FILTER', value: [values?.[0], value] });
	};

	return (
		<Accordion title="Rate Per Hour">
			<View>
				<MultiSlider values={values} sliderLength={UnistylesRuntime.screen.width - 64} onValuesChange={handleSliderChange} min={CONSTANTS.MIN_STUDIO_RATE} max={CONSTANTS.MAX_STUDIO_RATE} step={1000} selectedStyle={{ backgroundColor: theme.colors.typography }} unselectedStyle={{ backgroundColor: theme.colors.borderGray }} containerStyle={{ height: 40, width: '100%', alignItems: 'center' }} trackStyle={{ height: 2 }} customMarker={CustomMarker} />
				<View style={styles.sliderValues}>
					<Text size="bodySm" color="muted">
						{formatAmount(values[0])}/-
					</Text>
					<Text size="bodySm" color="muted">
						{formatAmount(values[1])}/-
					</Text>
				</View>
			</View>
			<View style={styles.minMaxContainer}>
				<View style={styles.textContainer}>
					<Text size="inputLabel" color="muted">
						Minimum Rate
					</Text>
					<TextInput style={styles.textinput} placeholder="Min rate" value={String(values[0])} placeholderTextColor={theme.colors.muted} onChangeText={handleMinInputChange} />
				</View>
				<View style={styles.textContainer}>
					<Text size="inputLabel" color="muted">
						Maximum Rate
					</Text>
					<TextInput style={styles.textinput} placeholder="Max rate" value={String(values[1])} placeholderTextColor={theme.colors.muted} onChangeText={handleMaxInputChange} />
				</View>
			</View>
		</Accordion>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	sliderValues: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
	},
	minMaxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.base,
	},
	textContainer: { flex: 1, gap: theme.gap.xxs },
}));
