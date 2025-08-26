import SearchInput from '@components/SearchInput';
import useGetAllConversations from '@network/useGetAllConversations';
import { FlashList } from '@shopify/flash-list';
import { useMessageContext } from '../MessagesContext';
import IMessage from '@models/entities/IMessage';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, RefreshControl, SafeAreaView, View } from 'react-native';
import { darkTheme } from '@touchblack/ui/theme';
import ConversationItem from '../ConversationItem';
import CONSTANTS from '@constants/constants';
import NoMessages from '@components/errors/NoMessages';
import FloatingButton from '@components/FloatingButton';
import { useAuth } from '@presenters/auth/AuthContext';

export default function ConversationsList() {
	const { state, dispatch } = useMessageContext();
	const { permissions, loginType } = useAuth();
	const allowed = loginType === 'producer' ? permissions?.includes('Messages::Edit') : true;
	const { data: rawData, isLoading, hasNextPage, fetchNextPage, isFetching, refetch } = useGetAllConversations();
	const data = rawData?.filter(it => it?.last_message);
	const filteredData = data?.filter((it: IMessage) => it.reciever_name?.toLowerCase()?.includes(state.query.toLowerCase()));
	const navigation = useNavigation();
	
	const handleFloatingButtonPress = () => {
		navigation.navigate('AddConversation');
	};

	function handleSearchQuery(text: string) {
		dispatch({ type: 'QUERY', value: text });
	}

	if (isLoading) {
		return (
			<SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
				<ActivityIndicator color={darkTheme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<>
			<SearchInput placeholderText={`Search user...`} searchQuery={state.query} setSearchQuery={handleSearchQuery} />
			<FlashList
				data={filteredData}
				renderItem={({ item, index }) => <ConversationItem index={index} item={item} />}
				estimatedItemSize={100}
				keyExtractor={item => item?.id || ''}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
				scrollEnabled={true}
				onEndReachedThreshold={0.5}
				showsVerticalScrollIndicator={true}
				ListEmptyComponent={
					<View style={{ flex: 1, height: (6.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoMessages />
					</View>
				}
			/>
			{allowed && <FloatingButton onPress={handleFloatingButtonPress} />}
		</>
	);
}
