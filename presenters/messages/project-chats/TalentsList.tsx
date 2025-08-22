import { FlashList } from '@shopify/flash-list';
import { useMemo } from 'react';
import ConversationItem from '../ConversationItem';
import useGetAllConversations from '@network/useGetAllConversations';
import NoStudioMessage from '@components/errors/NoStudioMessage';
import { View } from 'react-native';
import CONSTANTS from '@constants/constants';

export default function TalentsList({ projectId }) {
	const { data: invitations } = useGetAllConversations(projectId);

	const TalentListItem = useMemo(() => {
		return ({ item, index }) => <ConversationItem item={item} projectId={projectId} key={item.id} index={index} />;
	}, [projectId]);

	return (
		<FlashList
			data={invitations}
			renderItem={TalentListItem}
			estimatedItemSize={70}
			keyExtractor={item => item.id}
			ListEmptyComponent={
				<View style={{ flex: 1, zIndex: -9, height: (7 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
					<NoStudioMessage desc="" />
				</View>
			}
		/>
	);
}
