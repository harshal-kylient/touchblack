import Header from '@components/Header';
import { KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import StudioFloorAreaFilter from './StudioFloorAreaFilter';
import StudioFloorCatwalkFilter from './StudioFloorCatwalkFilter';
import StudioFloorRatePerShiftFilter from './StudioFloorRatePerShift';
import StudioFloorGeneratorBackupFilter from './StudioFloorGeneratorBackupFilter';
import StudioFloorSoundProofFilter from './StudioFloorSoundProofFilter';
import StudioFloorAirConditionFilter from './StudioFloorAirConditionFilter';
import { Button } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import { useStudioBookingContext } from './StudioContext';
import Animated from 'react-native-reanimated';
import StudioFloorAdvanceAmountFilter from './StudioFloorAdvanceAmountFilter';

export default function StudioFilter() {
	const { styles, theme } = useStyles();
	const { state, dispatch } = useStudioBookingContext();
	const navigation = useNavigation();

	function handleReset() {
		dispatch({ type: 'RESET_FILTERS' });
		navigation.goBack();
	}

	function handleApply() {
		navigation.goBack();
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Filters" />
			<Animated.ScrollView style={{ marginBottom: 80 }}>
				<StudioFloorAreaFilter state={state} dispatch={dispatch} />
				<StudioFloorCatwalkFilter state={state} dispatch={dispatch} />
				<StudioFloorRatePerShiftFilter state={state} dispatch={dispatch} />
				{/*<StudioFloorAdvanceAmountFilter state={state} dispatch={dispatch} />*/}
				<StudioFloorGeneratorBackupFilter state={state} dispatch={dispatch} />
				<StudioFloorSoundProofFilter state={state} dispatch={dispatch} />
				<StudioFloorAirConditionFilter state={state} dispatch={dispatch} />
				{/*<StudioFloorCityFilter state={state} dispatch={dispatch} />*/}
			</Animated.ScrollView>
			<View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.black, paddingHorizontal: theme.padding.base, paddingVertical: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, position: 'absolute', bottom: 20, minWidth: '100%' }}>
				<Button onPress={handleReset} type="secondary" textColor="regular" style={{ borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flex: 1 }}>
					Reset
				</Button>
				<Button onPress={handleApply} style={{ borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flex: 1 }}>
					Apply
				</Button>
			</View>
		</SafeAreaView>
	);
}
