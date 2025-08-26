import { ReactElement, useCallback, useState } from 'react';
import { View, ActivityIndicator, Pressable, FlatList, RefreshControl } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, TextInput } from '@touchblack/ui';

import { Bookmark, Search as SearchIcon } from '@touchblack/icons';
import UserItem from '@components/UserItem';
import useGetTeamMembers from '@network/useGetTeamMembers';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';

interface IProps {
	searchProducerId: UniqueId;
	header?: ReactElement;
	paddingBottom: number;
}

function Team({ searchProducerId, paddingBottom, header }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [query, setQuery] = useState('');
	const { businessOwnerId, loginType, userId, producerId } = useAuth();

	const navigation = useNavigation();
	const { data: response, isLoading, hasNextPage, fetchNextPage } = useGetTeamMembers(searchProducerId);
	const data = response?.pages?.flatMap(page => page?.data) || [];
	const filteredData = data?.filter(it => it?.first_name?.toLowerCase()?.includes(query.toLowerCase()) || it?.last_name?.toLowerCase()?.includes(query.toLowerCase()));

	function handleSearch() {}
	function handleInputChange(e: any) {
		setQuery(e.nativeEvent.text);
	}

	if (isLoading) {
		return <ActivityIndicator size="small" color={theme.colors.primary} style={{ backgroundColor: theme.colors.black, flex: 1 }} />;
	}

	const onItemPress = useCallback((id: string) => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.ProducerTeamMemberManagement,
				data: {
					userId: id,
				},
			},
		});
	}, []);

	return (
		<View style={{ flex: 1, minHeight: '100%', paddingBottom, backgroundColor: theme.colors.black }}>
			<View style={styles.searchInputContainer}>
				<SearchIcon style={styles.searchIcon} color="white" size="22" />
				<TextInput value={query} onSubmitEditing={handleSearch} onChange={handleInputChange} style={styles.textInput} placeholderTextColor={theme.colors.borderGray} placeholder="Search" />
			</View>
			<FlatList
				bounces={false}
				ListHeaderComponent={header}
				data={filteredData}
				// refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
				renderItem={({ item }: { item: any }) => (
					<UserItem
						key={item.id}
						name={(item.first_name || '') + ' ' + (item.last_name || '')}
						id={item.id}
						profession={item.profession_type}
						onPress={() => (loginType === 'producer' && userId === businessOwnerId && searchProducerId === producerId ? onItemPress(item?.id) : navigation.navigate('TalentProfile', { id: item?.id }))}
						image={item.profile_picture_url}
						//cta={ <Pressable> <Bookmark size="24" color={item.is_bookmarked ? theme.colors.primary : theme.colors.transparent} strokeColor={item.is_bookmarked ? theme.colors.primary : theme.colors.typography} strokeWidth={3} /> </Pressable> }
					/>
				)}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				ListEmptyComponent={
					<Text color="muted" size="button" textAlign="center">
						{query ? 'No member found' : 'No member added yet'}
					</Text>
				}
				keyExtractor={item => item.id}
			/>
		</View>
	);
}

export default Team;

const stylesheet = createStyleSheet(theme => ({
	searchInputContainer: {
		width: '100%',
		paddingVertical: theme.margins.base,
		paddingHorizontal: theme.padding.base,
		backgroundColor: theme.colors.black,
		position: 'relative',
		justifyContent: 'center',
		zIndex: 99,
	},
	textInput: {
		fontSize: theme.fontSize.button,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.xs,
		paddingLeft: 44,
		backgroundColor: theme.colors.black,
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
}));
