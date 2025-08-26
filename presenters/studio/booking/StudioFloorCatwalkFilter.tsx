import { Radio, RadioFilled } from '@touchblack/icons';
import { Accordion, Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export default function StudioFloorCatwalkFilter({ state, dispatch }) {
	const { theme } = useStyles();

	function handleSelection(value: boolean) {
		dispatch({ type: 'CATWALK_FILTER', value });
	}

	return (
		<Accordion title="Catwalk/Tarafa">
			<View style={{ minWidth: '100%', paddingHorizontal: theme.padding.base, flexDirection: 'row', borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, borderBottomWidth: theme.borderWidth.slim }}>
				<Pressable onPress={() => handleSelection(true)} style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: theme.gap.xxs, padding: theme.padding.base, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					{state?.filters?.catwalk === true ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}
					<Text color="regular" size="bodyMid">
						Yes
					</Text>
				</Pressable>
				<Pressable onPress={() => handleSelection(false)} style={{ flexDirection: 'row', flex: 1, alignItems: 'center', gap: theme.gap.xxs, padding: theme.padding.base, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					{state?.filters?.catwalk === false ? <RadioFilled size="24" color={theme.colors.primary} /> : <Radio size="24" color={theme.colors.muted} />}
					<Text color="regular" size="bodyMid">
						No
					</Text>
				</Pressable>
			</View>
		</Accordion>
	);
}
