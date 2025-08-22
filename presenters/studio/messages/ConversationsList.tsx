import { FlashList } from '@shopify/flash-list';
import { useMessageContext } from './MessagesContext';
import IMessage from '@models/entities/IMessage';
import { ActivityIndicator, RefreshControl, SafeAreaView, View } from 'react-native';
import { darkTheme } from '@touchblack/ui/theme';
import CONSTANTS from '@constants/constants';
import NoStudioMessage from '@components/errors/NoStudioMessage';
import SearchInput from '@components/SearchInput';
import useGetAllStudiosConversations from '@network/useGetAllStudiosConversations';
import StudioConversationItem from './StudioConversationItem';
import useHandleLogout from '@utils/signout';

export default function ConversationsList() {
	const { state } = useMessageContext();
	const { data: rawData, isLoading, hasNextPage, fetchNextPage, isFetching, refetch } = useGetAllStudiosConversations();
	const data = rawData?.data?.filter(it => it?.last_message);
	const status = rawData?.status;
	const logout = useHandleLogout(false);
	const filteredData = data?.filter((it: IMessage) => it.reciever_name?.toLowerCase()?.includes(state.query.toLowerCase()));

	if (status == 401) {
		logout();
	}

	if (isLoading) {
		return (
			<SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
				<ActivityIndicator color={darkTheme.colors.primary} />
			</SafeAreaView>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<SearchInput />
			<FlashList
				data={filteredData}
				renderItem={({ item, index }) => <StudioConversationItem studioChat index={index} item={item} />}
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
					<View style={{ flex: 1, zIndex: -9, height: (7 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoStudioMessage />
					</View>
				}
			/>
		</View>
	);
}
