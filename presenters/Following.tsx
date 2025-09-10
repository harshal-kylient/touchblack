import { ActivityIndicator, Platform, RefreshControl, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';
import UserItem from '@components/UserItem';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import UserNotFound from '@components/errors/UserNotFound';
import { Search as SearchIcon } from '@touchblack/icons';
import { useRef, useState, useMemo } from 'react';
import useGetFollowingList from '@network/useGetFollowingList';
import Header from '@components/Header';

function Following({ route }) {
	const user_id = route?.params?.userId;
	const heading = route?.params?.header;
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const [searchQuery, setSearchQuery] = useState('');
	const { data: response, isLoading, isFetching, refetch } = useGetFollowingList(user_id, heading);
	const textinputRef = useRef(null);

	// Get the raw data from response
	const rawData = response?.data || [];
	const pageCount = response?.pages?.[0]?.count || response?.count || 0;

	// Filter data based on search query
	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) {
			return rawData;
		}

		const query = searchQuery.toLowerCase().trim();
		return rawData.filter((item: any) => {
			const fullName = `${item?.first_name || ''} ${item?.last_name || ''}`.toLowerCase();
			const producerName = (item?.name || '').toLowerCase();
			return fullName.includes(query) || producerName.includes(query);
		});
	}, [rawData, searchQuery]);

	const handleSearch = (text: any) => {
		setSearchQuery(text);
	};

	return (
		<View style={styles.talentListContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name={heading}></Header>
			<View style={styles.searchInputContainer}>
				<SearchIcon style={styles.searchIcon} color="white" size="22" />
				<TextInput ref={textinputRef} autoFocus={true} value={searchQuery} onChangeText={handleSearch} style={styles.textInput} placeholderTextColor={theme.colors.borderGray} placeholder={`Search ${heading?.toLowerCase() || ''}...`} />
			</View>
			<View style={styles.flashListWrapper}>
				{isLoading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color={theme.colors.primary} />
					</View>
				) : (
					<FlashList
						data={filteredData}
						renderItem={({ item }) => {
							const isTalent = item?.first_name || item?.last_name;
							const displayName = isTalent ? `${item?.first_name || ''} ${item?.last_name || ''}`.trim() : item?.name;
							const profession = isTalent ? item?.talent_role : item?.producer_type;
							const navigateTo = isTalent ? 'TalentProfile' : 'ProducerProfile';

							return <UserItem name={displayName} id={item?.id} verified={item?.verified} profession={profession} onPress={() => navigation.navigate(navigateTo, { id: item.id })} image={createAbsoluteImageUri(item.profile_picture_url)} />;
						}}
						refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
						keyExtractor={item => item?.id?.toString() || ''}
						estimatedItemSize={64}
						onEndReachedThreshold={0.5}
						ListEmptyComponent={
							<View style={styles.emptyContainer}>
								<UserNotFound title={searchQuery ? 'No Results Found!' : heading === 'Followers' ? 'No Followers Found!' : 'No Following Found!'} desc={searchQuery ? 'Try adjusting your search terms' : heading === 'Followers' ? 'People who follow you will appear here.' : 'Start following people to see them here!'} />
							</View>
						}
					/>
				)}
			</View>
		</View>
	);
}

export default Following;

const stylesheet = createStyleSheet(theme => ({
	imageContainer: {
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	searchInputContainer: {
		width: '100%',
		marginVertical: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		position: 'relative',
		justifyContent: 'center',
		zIndex: 99,
	},
	textInput: {
		fontSize: theme.fontSize.button,
		fontFamily: theme.fontFamily.cgMedium,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingLeft: theme.padding.base * 3,
		backgroundColor: theme.colors.transparent,
	},
	searchIcon: {
		position: 'absolute',
		zIndex: 99,
		height: '100%',
		width: 56,
		left: theme.padding.base + (2 / 3) * theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
		pointerEvents: 'none',
	},
	listImage: {
		width: '100%',
		height: '100%',
	},
	listItemContainer: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	separatorView: {
		width: 16,
	},
	rightContentContainer: {
		flexDirection: 'row',
		gap: theme.padding.base,
	},
	flatlistContainer: {},
	placeholderContainer: {
		backgroundColor: theme.colors.black,
		paddingVertical: theme.padding.xxs,
		borderWidth: theme.borderWidth.slim,
		paddingTop: theme.margins.xxl,
	},
	talentListContainer: {
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
		backgroundColor: theme.colors.backgroundDarkBlack,
		zIndex: 1,
	},
	talentItem: {
		width: 'auto',
		flexGrow: 1,
		backgroundColor: theme.colors.black,
	},
	flashListWrapper: {
		flex: 1,
		marginBottom: theme.padding.base,
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyContainer: {
		marginTop: theme.padding.base * 3,
		justifyContent: 'center',
	},
}));
