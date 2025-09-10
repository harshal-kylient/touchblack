import { Dispatch, useRef, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, SafeAreaView, View, Pressable } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Tag, TagTypes, Text } from '@touchblack/ui';

import { IAction, IState } from '../FilterContext';
import SearchInput from '@components/SearchInput';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';
import useGetBrands from '@network/useGetBrands';
import IBrand from '@models/entities/IBrand';

interface IProps {
	state: IState['filmFilters'];
	dispatch: Dispatch<IAction>;
}

function BrandsFilter({ state, dispatch }: IProps) {
	const { styles } = useStyles(stylesheet);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [modalVisible, setModalVisible] = useState(false);
	const { data: response } = useGetBrands(searchQuery);
	const searchInputRef = useRef<View>(null);
	const [, setSearchInputLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

	const brands = response?.pages?.flatMap(page => page?.results) || [];
	const filteredBrands = brands.filter(item => item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) && !state?.brand.some((it: IBrand) => it.id === item.id));

	const handleSearchInputLayout = () => {
		if (searchInputRef.current) {
			searchInputRef.current.measure((x, y, width, height, pageX, pageY) => {
				setSearchInputLayout({ x: pageX, y: pageY, width, height });
			});
		}
	};

	const handleBrandClick = (brand: IBrand) => {
		const isAlreadySelected = state?.brand.some((it: IBrand) => it.id === brand.id);

		if (!isAlreadySelected) {
			dispatch({ type: 'BRANDS_ADD', value: brand });
			setModalVisible(false);
			setSearchQuery('');
		}
	};

	const handleRemoveBrand = (brand: IBrand) => {
		dispatch({ type: 'BRANDS_REMOVE', value: brand });
	};

	return (
		<Accordion title="Brands">
			<View ref={searchInputRef} onLayout={handleSearchInputLayout}>
				{!modalVisible && <SearchInput placeholderText="Brand name" containerStyles={styles.searchInput} searchQuery={searchQuery} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />}
				<Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
					<SafeAreaView style={styles.modalContainer}>
						<Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
							<View style={[styles.modalContent]}>
								<SearchInput placeholderText="Brand name" onSubmitEditing={() => setModalVisible(false)} autoFocus searchQuery={searchQuery} containerStyles={styles.searchInput} onPress={() => setModalVisible(true)} setSearchQuery={setSearchQuery} />
								<ScrollView style={styles.searchResultsContainer}>
									{filteredBrands.map((brand: IBrand) => (
										<TouchableOpacity activeOpacity={0.9} onPress={() => handleBrandClick(brand)} key={brand.id} style={styles.searchResultItem}>
											<Text size="primarySm" numberOfLines={1} color="regular">
												{brand.name}
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
				{state?.brand?.map((brand: IBrand) => (
					<Tag key={brand.id} label={brand.name} onPress={() => handleRemoveBrand(brand)} type={'actionable' as TagTypes} />
				))}
			</ScrollableHorizontalGrid>
		</Accordion>
	);
}

export default BrandsFilter;

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
