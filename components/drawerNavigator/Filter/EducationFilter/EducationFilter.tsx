import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Accordion, Tag, TagTypes, Text } from '@touchblack/ui';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import { useFilterContext } from '../FilterContext';
import IInstitute from '@models/entities/IInstitute';
import useGetEducations from '@network/useGetEducations';
import getCurrentFilter from '../getCurrentFilter';

function EducationFilter() {
	const { styles, theme } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [modalVisible, setModalVisible] = useState(false);
	const { state, dispatch } = useFilterContext();
	const [, setSearchInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	const searchInputRef = useRef<View>(null);
	const { data: response } = useGetEducations();

	const institutes = response?.pages?.flatMap(page => page) || [];
	const filteredInstitues = institutes.filter(item => item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) && !state[getCurrentFilter(state.activeTab)].institutes_ids.some((it: IInstitute) => it.id === item.id));

	const handleSearchInputLayout = () => {
		if (searchInputRef.current) {
			searchInputRef.current.measure((x, y, width, height, pageX, pageY) => {
				setSearchInputLayout({ x: pageX, y: pageY, width, height });
			});
		}
	};

	const handleInstituteClick = (institute: IInstitute) => {
		const isAlreadySelected = state[getCurrentFilter(state.activeTab)].institutes_ids.some((item: IInstitute) => item.id === institute.id);

		if (!isAlreadySelected) {
			dispatch({ type: 'INSTITUTES_ADD', value: { id: institute.id, name: institute.name } });
			setModalVisible(false);
			setSearchQuery('');
		}
	};

	const handleRemoveInstitute = (institue: IInstitute) => {
		dispatch({ type: 'INSTITUTES_REMOVE', value: { id: institue.id, name: institue.name } });
	};

	return (
		<Accordion title="Education">
			<View ref={searchInputRef} onLayout={handleSearchInputLayout}>
				{!modalVisible && <SearchInput placeholderText="University/College" containerStyles={styles.searchInput} searchQuery={searchQuery} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />}
				<Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<SafeAreaView style={styles.modalContainer}>
						<Pressable onPress={() => setModalVisible(false)}>
							<View style={styles.modalContent}>
								<SearchInput placeholderText="University/College" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={[styles.searchInput, { padding: theme.padding.xs }]} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
								<ScrollView style={styles.searchResultsContainer}>
									{filteredInstitues.map(institute => (
										<TouchableOpacity activeOpacity={0.9} onPress={() => handleInstituteClick(institute)} key={institute.id} style={styles.searchResultItem}>
											<Text size="primarySm" numberOfLines={1} color="regular">
												{institute.name}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</Pressable>
					</SafeAreaView>
				</Modal>
			</View>
			<ScrollableHorizontalGrid gridStyles={{ borderTopWidth: 0 }}>
				{state[getCurrentFilter(state.activeTab)].institutes_ids.map((it: IInstitute) => {
					return <Tag key={it.id} label={it.name} onPress={() => handleRemoveInstitute(it)} type={'actionable' as TagTypes} />;
				})}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default EducationFilter;

const stylesheet = createStyleSheet(theme => ({
	searchResultsContainer: {
		width: '100%',
		paddingHorizontal: theme.padding.base,
		marginTop: -theme.padding.base,
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
		minHeight: UnistylesRuntime.screen.height,
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
