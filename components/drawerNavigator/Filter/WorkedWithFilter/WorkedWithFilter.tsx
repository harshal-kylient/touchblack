import { useRef, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Tag, TagTypes, Text } from '@touchblack/ui';

import { useFilterContext } from '../FilterContext';
import IProducerSearchDto from '@models/dtos/IProducerSearch';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetProducers from '@network/useGetProducers';
import getCurrentFilter from '../getCurrentFilter';

function WorkedWithFilter() {
	const { styles } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [modalVisible, setModalVisible] = useState(false);
	const { state, dispatch } = useFilterContext();
	const { data: response } = useGetProducers(searchQuery);
	const searchInputRef = useRef<View>(null);
	const [, setSearchInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

	const producers = response?.pages?.flatMap(page => page?.results) || [];
	const filteredProducers = producers.filter(item => item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) && !state[getCurrentFilter(state.activeTab)].works_with.some(it => it.id === item.id));

	const handleSearchInputLayout = () => {
		if (searchInputRef.current) {
			searchInputRef.current.measure((x, y, width, height, pageX, pageY) => {
				setSearchInputLayout({ x: pageX, y: pageY, width, height });
			});
		}
	};

	const handleProducerClick = (producer: IProducerSearchDto) => {
		const isAlreadySelected = state[getCurrentFilter(state.activeTab)].works_with.some(it => it.id === producer.id);

		if (!isAlreadySelected) {
			dispatch({ type: 'WORKED_WITH_ADD', value: producer });
			setModalVisible(false);
			setSearchQuery('');
		}
	};

	const handleRemoveProducer = (producer: IProducerSearchDto) => {
		dispatch({ type: 'WORKED_WITH_REMOVE', value: producer });
	};

	return (
		<Accordion title="Worked With">
			<View ref={searchInputRef} onLayout={handleSearchInputLayout}>
				{!modalVisible ? <SearchInput placeholderText="Production House" containerStyles={styles.searchInput} searchQuery={searchQuery} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} /> : null}
				<Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
						<SafeAreaView style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<SearchInput placeholderText="Production House" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
								<ScrollView style={styles.searchResultsContainer}>
									{filteredProducers.map(producer => (
										<TouchableOpacity activeOpacity={0.9} onPress={() => handleProducerClick(producer)} key={producer.id} style={styles.searchResultItem}>
											<Text size="primarySm" numberOfLines={1} color="regular">
												{producer.name}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</SafeAreaView>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
			<ScrollableHorizontalGrid gridStyles={{ borderTopWidth: 0 }}>
				{state[getCurrentFilter(state.activeTab)].works_with.map(producer => (
					<Tag key={producer.id} label={producer.name} onPress={() => handleRemoveProducer(producer)} type={'actionable' as TagTypes} />
				))}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default WorkedWithFilter;

const stylesheet = createStyleSheet(theme => ({
	searchResultsContainer: {
		width: '100%',
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
