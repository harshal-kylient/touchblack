import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Button, Text } from '@touchblack/ui';

import { IAction, IState } from '../FilterContext';
import CONSTANTS from '@constants/constants';
import { Dispatch } from 'react';

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

function DurationFilter({ state, dispatch }: IProps) {
	const { theme } = useStyles(stylesheet);
	const values = [state?.duration?.[0], state?.duration?.[1]];
	const selectedIndex0 = values[0] === 0 && values[1] === 30;
	const selectedIndex1 = values[0] === 31 && values[1] === 60;
	const selectedIndex2 = values[0] === 61 && values[1] === 180;
	const selectedIndex3 = values[0] === 180 && values[1] === CONSTANTS.MAX_DRUATION;

	function handleDurationPick(index: number) {
		let value;
		switch (index) {
			case 0:
				value = [0, 30];
				if (selectedIndex0) value = undefined;
				break;
			case 1:
				value = [31, 60];
				if (selectedIndex1) value = undefined;
				break;
			case 2:
				value = [61, 180];
				if (selectedIndex2) value = undefined;
				break;
			case 3:
				value = [180, CONSTANTS.MAX_DRUATION];
				if (selectedIndex3) value = undefined;
				break;
			default:
				return;
		}
		dispatch({ type: 'DURATION', value });
	}

	return (
		<Accordion title="Duration">
			<Text size="bodyMid" color="muted" style={{ paddingHorizontal: theme.padding.base, marginBottom: theme.padding.base }}>
				Duration in seconds
			</Text>
			<View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: theme.padding.base, marginBottom: theme.padding.base }}>
				<Button onPress={() => handleDurationPick(0)} type={selectedIndex0 ? 'primary' : 'inline'} textColor={selectedIndex0 ? 'black' : 'primary'} style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: 8 }}>
					0 - 30
				</Button>
				<Button onPress={() => handleDurationPick(1)} type={selectedIndex1 ? 'primary' : 'inline'} textColor={selectedIndex1 ? 'black' : 'primary'} style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: 8 }}>
					31 - 60
				</Button>
				<Button onPress={() => handleDurationPick(2)} type={selectedIndex2 ? 'primary' : 'inline'} textColor={selectedIndex2 ? 'black' : 'primary'} style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: 8 }}>
					61 - 180
				</Button>
				<Button onPress={() => handleDurationPick(3)} type={selectedIndex3 ? 'primary' : 'inline'} textColor={selectedIndex3 ? 'black' : 'primary'} style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: 8 }}>
					180+
				</Button>
			</View>
		</Accordion>
	);
}

export default DurationFilter;

const stylesheet = createStyleSheet(theme => ({
	minMaxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.base,
	},
	textContainer: { flex: 1, gap: theme.gap.xxs },
	textinput: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	sliderStyles: {
		height: 40,
		width: '100%',
		alignItems: 'center',
	},
}));
