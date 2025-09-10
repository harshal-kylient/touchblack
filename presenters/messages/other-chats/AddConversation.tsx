import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import UserItem from '@components/UserItem';
import { useState } from 'react';
import useGetAllUsers from '@network/useGetAllUsers';
import { FlashList } from '@shopify/flash-list';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { Bookmark } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';
import capitalized from '@utils/capitalized';
import UserNotFound from '@components/errors/UserNotFound';
import CONSTANTS from '@constants/constants';
import { useAuth } from '@presenters/auth/AuthContext';

export default function AddConversation() {
	const { styles, theme } = useStyles(stylesheet);
	const [query, setQuery] = useState('');
	const { loginType } = useAuth();
	const { data: response, isLoading, hasNextPage, fetchNextPage } = useGetAllUsers(query, loginType === 'producer' ? 'User' : 'Producer');

	const data = response?.pages?.flatMap(page => page?.results) || [];
	const navigation = useNavigation();

	function handleAddConversation(id: UniqueId, name: string, picture: string, producer_type: string) {
		navigation.navigate('Conversation', { id: null, receiver_id: id, name, picture, receiver_type: producer_type ? 'Producer' : 'User' });
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name={`Select ${loginType === 'producer' ? 'Talent' : 'Producer'}`} />
			<SearchInput placeholderText={`Search ${loginType === 'producer' ? 'Talent' : 'Producer'}...`} searchQuery={query} setSearchQuery={setQuery} />
			<FlashList
				bounces={false}
				data={data}
				renderItem={({ item }) => {
					const name = (item?.first_name || item?.name || '') + ' ' + (item?.last_name || '');
					const picture = createAbsoluteImageUri(item.profile_picture_url);
					return <UserItem name={name} id={item.id} profession={item.profession_type || capitalized(item?.producer_type?.replace('_', ' '))} onPress={() => handleAddConversation(item.id, name, picture, item.producer_type)} image={picture} cta={item?.is_bookmarked ? <Bookmark size="24" color={theme.colors.primary} strokeColor={theme.colors.primary} strokeWidth={2} /> : null} />;
				}}
				estimatedItemSize={71}
				keyExtractor={item => item?.id || ''}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				scrollEnabled={true}
				onEndReachedThreshold={0.5}
				showsVerticalScrollIndicator={true}
				ListEmptyComponent={
					isLoading ? (
						<ActivityIndicator />
					) : (
						<View style={{ flex: 1, height: (7 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<UserNotFound />
						</View>
					)
				}
			/>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
}));
