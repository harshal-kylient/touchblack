import Header from '@components/Header';
import BrandsFilter from '@components/drawerNavigator/Filter/BrandsFilter/BrandsFilter';
import DurationFilter from '@components/drawerNavigator/Filter/DurationFilter/DurationFilter';
import IndustryFilter from '@components/drawerNavigator/Filter/IndustryFilter/IndustryFilter';
import LanguageFilter from '@components/drawerNavigator/Filter/LanguageFilter/LanguageFilter';
import TypesOfFilmsFilter from '@components/drawerNavigator/Filter/TypesOfFilmsFilter/TypesOfFilmsFilter';
import YearOfReleaseFilter from '@components/drawerNavigator/Filter/YearOfReleaseFilter/YearOfReleaseFilter';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button } from '@touchblack/ui';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFilterContext } from './FilterContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ProducerFilmsFilter() {
	const { theme } = useStyles(stylesheet);
	const [message, setMessage] = useState('');
	const { state, dispatch } = useFilterContext();
	const navigation = useNavigation();

	const handleReset = useCallback(() => {
		dispatch({ type: 'RESET_FILTERS' });
		setMessage('Filters have been reset');
		setTimeout(() => setMessage(''), 3000);
	}, [dispatch, navigation]);

	const handleFilter = useCallback(() => {
		navigation.goBack();
	}, [navigation]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name="Filters" />
			<KeyboardAwareScrollView style={{ flex: 1 }}>
				<TypesOfFilmsFilter state={state} dispatch={dispatch} />
				<BrandsFilter state={state} dispatch={dispatch} />
				<IndustryFilter state={state} dispatch={dispatch} />
				<LanguageFilter state={state} dispatch={dispatch} />
				<YearOfReleaseFilter state={state} dispatch={dispatch} />
				<DurationFilter state={state} dispatch={dispatch} />
			</KeyboardAwareScrollView>
			{message ? (
				<Pressable onPress={() => setMessage('')} style={{ justifyContent: 'center', alignItems: 'center', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xxs }}>
					<Text color="regular" size="bodyBig" style={{ color: theme.colors.success }}>
						{message}
					</Text>
				</Pressable>
			) : null}
			<View style={{ paddingHorizontal: theme.padding.base, flexDirection: 'row', minWidth: '100%' }}>
				<Button onPress={handleReset} type="secondary" textColor="regular" style={{ borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flex: 1 }}>
					Reset
				</Button>
				<Button onPress={handleFilter} type="primary" style={{ borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flex: 1 }}>
					Apply
				</Button>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(() => ({}));
