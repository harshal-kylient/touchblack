import { useCallback } from 'react';
import { StatusBar, Text as RNText, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useAuth } from '@presenters/auth/AuthContext';
import BlackBookFooter from './BlackBookFooter';
import BlackBookAccordion from './BlackBookAccordion';
import UserNotFound from '@components/errors/UserNotFound';
import CONSTANTS from '@constants/constants';
import BlackbookProfessionsList from './BlackbookProfessionsList';
import SearchInput from '@components/SearchInput';
import useBlackBookData from './useBlackBookData';
import TextPlaceholder from '@components/loaders/TextPlaceholder';
import SearchBarPlaceholder from '@components/loaders/SearchBarPlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import ImageAndTextListPlaceholder from '@components/loaders/ImageAndTextListPlaceholder';
import { IProfessionData } from '@models/dtos/IProfessionData';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import Header from '@components/Header';
import { FilterList } from '@touchblack/icons';
import transformTalentFilter from '@models/transformers/transformTalentFilter';
import transformFilmFilter from '@models/transformers/transformFilmFilter';

type BlackBookParams = {
	profession_type?: string;
};

function BlackBook() {
	const route = useRoute<RouteProp<Record<string, BlackBookParams>, string>>();
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<any>();
	const { userId, producerId, loginType,  } = useAuth();
	const { dispatch: searchDispatch, state } = useFilterContext();
	
	
	const { blackbookData, searchQuery, setSearchQuery, searchedBlackBookListExcludingArchivedProfiles, isLoadingSearchedBlackbook } = useBlackBookData(loginType === 'producer' ? producerId : userId);
	useFocusEffect(
		useCallback(() => {
			setSearchQuery('');
			searchDispatch({ type: 'QUERY', value: '' });
			searchDispatch({ type: 'RESET_FILTERS' });
		}, [setSearchQuery, searchDispatch]),
	);


	return (
		<SafeAreaView style={styles.blackBookScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.black} />
			<Header name="My favorites" />
			<View style={styles.searchContainer}>
				<SearchInput searchQuery={searchQuery} containerStyles={{ width: '90%' }} setSearchQuery={setSearchQuery} placeholderText="Search Talent..." />
				<TouchableOpacity
				// onPress={() => {
				// 	navigation.navigate('Filter');
				// }}
				>
					<FilterList color={theme.colors.typography} size="24" strokeColor={theme.colors.typography} />
					{/* <FilterList color={filters ? theme.colors.primary : theme.colors.typography} size="24" strokeColor={theme.colors.typography} />
					{filters ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, position: 'absolute', top: 1, right: -5 }}></View> : null} */}
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.blackBookContainer}>
				{isLoadingSearchedBlackbook ? (
					<ImageAndTextListPlaceholder />
				) : (
					<FlashList
						data={searchedBlackBookListExcludingArchivedProfiles}
						renderItem={({ item, index }) => <BlackBookAccordion key={index} profession={item} />}
						estimatedItemSize={97}
						ListEmptyComponent={
							<View style={{ flex: 1, height: (6 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
								<UserNotFound />
							</View>
						}
						ListFooterComponentStyle={{ paddingBottom: 40 }}
					/>
				)}
			</ScrollView>
			<View style={styles.footerContainer}>
				<BlackBookFooter archived_blackbooks_count={blackbookData?.archived_blackbooks_count || 0} />
			</View>
		</SafeAreaView>
	);
}

export default BlackBook;

const stylesheet = createStyleSheet(theme => ({
	blackBookScreenContainer: {
		width: '100%',
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	searchContainer:{
		flexDirection:'row',
		paddingVertical:-theme.padding.sm,
		alignItems:'center'
	},
	blackBookHeaderContainer: {
		flexDirection: 'row',
		backgroundColor: theme.colors.black,
		justifyContent: 'space-between',
		paddingHorizontal: theme.padding.base,
	},
	blackBookHeaderTitle: {
		fontFamily: theme.fontFamily.cgMedium,
		fontSize: theme.fontSize.primaryH2,
		color: theme.colors.typography,
	},
	blackBookContainer: {
		backgroundColor: theme.colors.black,
		paddingTop: theme.margins.xxl,
		flex: 1,
		marginBottom: 40, // height of the archived list line button
	},
	footerContainer: {
		width: '100%',
	},
	accordionContainer: {
		backgroundColor: theme.colors.black,
	},
	userNotFoundContainer: {
		flex: 1,
		height: (5.5 * CONSTANTS.screenHeight) / 10,
		width: '100%',
		justifyContent: 'center',
	},
}));
