import IMessageItem from '@models/entities/IMessageItem';
import { useQueryClient } from '@tanstack/react-query';
import StudioClaim from './StudioClaim';
import StudioConfirmation from './StudioConfirmation';
import useSentByMe from './useSentByMe';

export default function StudioNegotiationMessage({ item, last_negotiation_id, last_negotiation_status, conversation_id }: { item: IMessageItem; last_negotiation_id: UniqueId; conversation_id: UniqueId; last_negotiation_status: 'pending' | 'confirmed' }) {
	const queryClient = useQueryClient();
	const sentByMe = useSentByMe(item);
	const enabled = last_negotiation_id === item?.content?.negotiation?.id && last_negotiation_status === 'pending';

	if (item?.content?.confirmed) {
		return <StudioConfirmation item={item} />;
	}
	return (
		<StudioClaim
			conversation_id={conversation_id}
			onConfirm={async () => {
				await queryClient.invalidateQueries('useGetTalentCalendarList');
				await queryClient.invalidateQueries('useGetProducerCalendarList');
			}}
			enabled={enabled}
			item={item}
			sender_name={item?.sender_name}
		/>
	);
}
