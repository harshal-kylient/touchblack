import { useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Tag, TagTypes, Text } from '@touchblack/ui';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetAwards from '@network/useGetAwards';
import { useFilterContext } from '../FilterContext';
import getCurrentFilter from '../getCurrentFilter';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IAward {
	id: string;
	name: string;
	black_enum_type: string;
	description: string | null;
	extra_data: any | null;
	created_at: string;
	updated_at: string;
}

function AwardsFilter() {
	const { styles } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { data: response } = useGetAwards();
	const { state, dispatch } = useFilterContext();
	const [modalVisible, setModalVisible] = useState(false);
	const [, setSearchInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	const searchInputRef = useRef<View>(null);

	const awards = response?.pages?.flatMap(page => page) || [];
	const filteredAwards = awards.filter(item => item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) && !state[getCurrentFilter(state.activeTab)].award_ids.some((it: IAward) => it?.id === item.id));

	const handleSearchInputLayout = () => {
		if (searchInputRef.current) {
			searchInputRef.current.measure((x, y, width, height, pageX, pageY) => {
				setSearchInputLayout({ x: pageX, y: pageY, width, height });
			});
		}
	};

	const handleAwardClick = (award: IAward) => {
		const isAlreadySelected = state[getCurrentFilter(state.activeTab)].award_ids.some((value: IAward) => value.id === award.id);

		if (!isAlreadySelected) {
			dispatch({ type: 'AWARDS_ADD', value: { id: award.id, name: award.name } });
			setModalVisible(false);
			setSearchQuery('');
		}
	};

	const handleRemoveAward = (award: IAward) => {
		dispatch({ type: 'AWARDS_REMOVE', value: { id: award.id, name: award.name } });
	};

	return (
		<Accordion title="Awards">
			<View ref={searchInputRef} onLayout={handleSearchInputLayout}>
				{!modalVisible && <SearchInput placeholderText="Awards/Achievements" containerStyles={styles.searchInput} searchQuery={searchQuery} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />}
				<Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<SafeAreaView style={styles.modalContainer}>
						<Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
							<View style={[styles.modalContent]}>
								<SearchInput placeholderText="Awards/Achievements" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
								<ScrollView style={styles.searchResultsContainer}>
									{filteredAwards.map((award: IAward) => (
										<TouchableOpacity activeOpacity={0.9} onPress={() => handleAwardClick(award)} key={award.id} style={styles.searchResultItem}>
											<Text size="primarySm" numberOfLines={1} color="regular">
												{award.name}
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
				{state[getCurrentFilter(state.activeTab)]?.award_ids?.map((award: IAward) => {
					return <Tag key={award.id} label={award.name} onPress={() => handleRemoveAward(award)} type={'actionable' as TagTypes} />;
				})}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default AwardsFilter;

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
		...Platform.select({
			ios: {
				paddingTop: 50,
			},
		}),
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
