import useGetAllStudiosConversations from '@network/useGetAllStudiosConversations';
import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import ConversationItem from '../ConversationItem';
import { View } from 'react-native';
import NoStudioMessage from '@components/errors/NoStudioMessage';
import CONSTANTS from '@constants/constants';

interface IProps {
	projectId: UniqueId;
}

export default function StudiosList({ projectId }: IProps) {
	const { data: response } = useGetAllStudiosConversations(projectId);
	const data = response?.data;

	const StudioListItem = useMemo(() => {
		return ({ item, index }) => <ConversationItem item={item} studioChat projectId={projectId} key={item.id} index={index} />;
	}, [projectId]);

	return (
		<FlashList
			data={data}
			estimatedItemSize={70}
			renderItem={StudioListItem}
			keyExtractor={(item, index) => String(index)}
			ListEmptyComponent={
				<View style={{ flex: 1, zIndex: -9, height: (7 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
					<NoStudioMessage desc="" />
				</View>
			}
		/>
	);
}
