import { Search as SearchIcon } from '@touchblack/icons';
import { Accordion, Tag, Text, TextInput } from '@touchblack/ui';
import { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Animated from 'react-native-reanimated';
import useGetDistricts from '@network/useGetDistricts';

export default function StudioFloorCityFilter({ state, dispatch }) {
	const { styles, theme } = useStyles(stylesheet);
	const [query, setQuery] = useState('');
	const cityInputRef = useRef();
	const { data } = useGetDistricts(query);
	const districts = data?.pages?.flatMap(it => it?.results) || [];

	function onChange(value: any) {
		dispatch({ type: 'CITY_FILTER', value: value || null });
	}

	return (
		<Accordion title="City">
			<View style={styles.searchInputContainer}>
				<View style={styles.searchContainer}>
					<SearchIcon style={styles.searchIcon} color="white" size="20" />
					<TextInput value={query} ref={cityInputRef} onSubmitEditing={e => setQuery(e.nativeEvent.text)} onChangeText={setQuery} style={styles.searchInput} placeholderTextColor={theme.colors.borderGray} placeholder="Search district" />
				</View>
				{state.filters?.city_id?.name ? <Tag label={state.filters?.city_id?.name} onPress={onChange} type="actionable" /> : null}
				{query && cityInputRef.current?.isFocused() ? (
					<Animated.ScrollView style={[styles.dropdownItems, { height: Math.min(4, districts.length || 1) * 57 }]}>
						{districts?.map((item: any, index: number) => (
							<TouchableOpacity
								key={index}
								style={styles.dropdownItem}
								onPress={() => {
									onChange({ id: item.id, name: item.name });
									setQuery('');
								}}>
								<Text size="bodyMid" color="regular">
									{item.name}
								</Text>
							</TouchableOpacity>
						))}
						{!districts?.length && (
							<View style={{ flex: 1, paddingTop: theme.padding.base, justifyContent: 'center', alignItems: 'center' }}>
								<Text size="bodyBig" color="muted">
									No district found
								</Text>
							</View>
						)}
					</Animated.ScrollView>
				) : null}
			</View>
		</Accordion>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textInput: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		minHeight: 55,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	disabledInput: (disabled: boolean) => ({
		backgroundColor: disabled ? '#292929' : theme.colors.black,
	}),
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	textArea: {
		height: 80,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
	xxlgap: { gap: theme.gap.xxl },
	xxxlBottomMargin: { marginBottom: theme.margins.xxxl },
	baseMargin: { margin: theme.margins.base },
	widthHalf: { width: '50%' },
	footer: {
		display: 'flex',
		width: '100%',
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: theme.margins.base,
	},
	fileInputContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.xxxxl,
		paddingVertical: theme.padding.xxxxl,
		backgroundColor: theme.colors.black,
	},
	fileInputHeader: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
		color: theme.colors.borderGray,
	},
	fileInputText: {
		fontFamily: 'CabinetGrotesk-Regular',
		color: theme.colors.borderGray,
	},
	datesContainer: {
		gap: theme.gap.base,
		paddingHorizontal: theme.padding.base,
	},
	errorText: {
		marginHorizontal: theme.margins.base,
		marginTop: theme.margins.xs,
	},

	searchInput: {
		paddingHorizontal: theme.padding.xxs,
		width: '100%',
		marginBottom: 0,
	},
	searchResultItem: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	modalContainer: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	modalContent: {
		alignItems: 'center',
	},
	closeButton: {
		alignSelf: 'flex-end',
		marginBottom: 10,
	},
	closeButtonText: {
		color: 'red',
		fontSize: 18,
	},

	container: {
		zIndex: 1,
		paddingHorizontal: theme.padding.base,
	},
	searchContainer: {
		flexDirection: 'row',
		zIndex: 9,
		minHeight: 54,
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		paddingHorizontal: theme.padding.base,
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingLeft: 10,
		flex: 1,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	searchContainerWithResults: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.xxl,
		flex: 1,
	},
	textTag: {
		paddingLeft: theme.padding.xxs,
	},
	text: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		paddingTop: theme.padding.xxxxl,
	},
	inputContainer: {
		marginTop: theme.margins.base,
	},
	tabBg: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	searchInputContainer: {
		justifyContent: 'center',
		zIndex: 9,
		marginHorizontal: theme.margins.base,
	},
	searchIcon: {
		zIndex: 99,
		width: 56,
	},
	dropdownItems: {
		zIndex: 999999,
		backgroundColor: theme.colors.backgroundLightBlack,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItem: {
		borderBottomWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.xxs,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xl,
	},
}));
