import { useState, useRef } from 'react';
import { Modal, ScrollView, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Tag, TagTypes, Text } from '@touchblack/ui';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import { useFilterContext } from '../FilterContext';
import getCurrentFilter from '../getCurrentFilter';
import useGetDistricts from '@network/useGetDistricts';
import capitalized from '@utils/capitalized';

interface IPincode {
	district_id: string;
	id: string;
	name: string;
	status: string;
}
function HomeLocationFilter() {
	const { styles } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [modalVisible, setModalVisible] = useState(false);
	const searchInputRef = useRef<View>(null);
	const { data: response } = useGetDistricts(capitalized(searchQuery));
	const { state, dispatch } = useFilterContext();
	const [, setSearchInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

	const locations = response?.pages?.flatMap(page => page?.results) || [];
	const filteredLocations = locations.filter(location => location?.name?.includes(searchQuery) && !state[getCurrentFilter(state.activeTab)].location_id.some((it: IPincode) => it.id === location.id));

	const handleSearchInputLayout = () => {
		if (searchInputRef.current) {
			searchInputRef.current.measure((x, y, width, height, pageX, pageY) => {
				setSearchInputLayout({ x: pageX, y: pageY, width, height });
			});
		}
	};

	const handleLocationClick = (location: IPincode) => {
		const isAlreadySelected = state[getCurrentFilter(state.activeTab)].location_id.some((it: IPincode) => it.id === location.id);

		if (!isAlreadySelected) {
			dispatch({ type: 'LOCATIONS_ADD', value: location });
			setModalVisible(false);
			setSearchQuery('');
		}
	};

	const handleRemoveLocation = (location: IPincode) => {
		dispatch({ type: 'LOCATIONS_REMOVE', value: location });
	};

	return (
		<Accordion title="Home Location">
			<View ref={searchInputRef} onLayout={handleSearchInputLayout}>
				{!modalVisible && <SearchInput placeholderText="City/Postal address" containerStyles={styles.searchInput} searchQuery={searchQuery} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />}
				<Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
						<SafeAreaView style={styles.modalContainer}>
							<View style={[styles.modalContent]}>
								<SearchInput placeholderText="City/Postal address" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
								<ScrollView style={styles.searchResultsContainer}>
									{filteredLocations.map(location => (
										<TouchableOpacity activeOpacity={0.9} onPress={() => handleLocationClick(location)} key={location.id} style={styles.searchResultItem}>
											<Text size="primarySm" color="regular">{`${location?.name}`}</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</SafeAreaView>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
			<ScrollableHorizontalGrid gridStyles={{ borderTopWidth: 0 }}>
				{state[getCurrentFilter(state.activeTab)].location_id.map((location: IPincode) => (
					<Tag key={location.id} label={`${location?.name}`} onPress={() => handleRemoveLocation(location)} type={'actionable' as TagTypes} />
				))}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default HomeLocationFilter;

const stylesheet = createStyleSheet(theme => ({
	searchResultsContainer: {
		width: '100%',
		marginTop: -2,
		paddingHorizontal: theme.padding.base,
		height: 235,
	},
	searchInput: {
		width: '100%',
		marginBottom: 15,
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
		width: UnistylesRuntime.screen.width,
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
}));
