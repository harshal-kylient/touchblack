import { View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { Accordion, Text, TextInput } from '@touchblack/ui';

import { IAction, IState } from '../FilterContext';
import CustomMarker from '../CustomMarker';
import CONSTANTS from '@constants/constants';
import { Dispatch } from 'react';

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

function YearOfReleaseFilter({ state, dispatch }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const values = [state?.year_of_release?.[0], state?.year_of_release?.[1]];

	const handleSliderChange = (value: number[]) => {
		dispatch({ type: 'YEAR_OF_RELEASE', value });
	};

	const handleMinInputChange = (text: string) => {
		const value = parseInt(text) || 0;
		dispatch({ type: 'YEAR_OF_RELEASE', value: [value, state?.year_of_release[1]] });
	};

	const handleMaxInputChange = (text: string) => {
		const value = parseInt(text) || 0;
		dispatch({ type: 'YEAR_OF_RELEASE', value: [state?.year_of_release[0], value] });
	};

	return (
		<Accordion title="Year of Release">
			<View>
				<MultiSlider values={values} sliderLength={UnistylesRuntime.screen.width - 64} onValuesChange={handleSliderChange} min={CONSTANTS.MIN_RELEASE_YEAR} max={CONSTANTS.MAX_RELEASE_YEAR} step={1} selectedStyle={{ backgroundColor: theme.colors.typography }} unselectedStyle={{ backgroundColor: theme.colors.borderGray }} containerStyle={{ height: 40, width: '100%', alignItems: 'center' }} trackStyle={{ height: 2 }} customMarker={CustomMarker} />
				<View style={styles.sliderValues}>
					<Text size="bodySm" color="muted">
						{values[0]}
					</Text>
					<Text size="bodySm" color="muted">
						{values[1]}
					</Text>
				</View>
			</View>
			<View style={styles.minMaxContainer}>
				<View style={styles.textContainer}>
					<Text size="inputLabel" color="muted">
						Minimum Year
					</Text>
					<TextInput style={styles.textinput} placeholder="Min year" value={String(values[0])} placeholderTextColor={theme.colors.muted} onChangeText={handleMinInputChange} />
				</View>
				<View style={styles.textContainer}>
					<Text size="inputLabel" color="muted">
						Maximum Year
					</Text>
					<TextInput style={styles.textinput} placeholder="Max year" value={String(values[1])} placeholderTextColor={theme.colors.muted} onChangeText={handleMaxInputChange} />
				</View>
			</View>
		</Accordion>
	);
}

export default YearOfReleaseFilter;

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
