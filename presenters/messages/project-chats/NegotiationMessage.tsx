import Claim from './Claim';
import ClaimTalentView from './ClaimTalentView';
import IMessageItem from '@models/entities/IMessageItem';
import Confirmation from './Confirmation';
import { useQueryClient } from '@tanstack/react-query';
import useSentByMe from './useSentByMe';

export default function NegotiationMessage({ item, last_negotiation_status, last_negotiation_id, conversation_id }: { item: IMessageItem; last_negotiation_id: UniqueId; conversation_id: UniqueId; last_negotiation_status: 'pending' | 'confirmed' }) {
	const queryClient = useQueryClient();
	const sentByMe = useSentByMe(item);
	const enabled = last_negotiation_id === item?.content?.negotiation?.id && last_negotiation_status == 'pending';

	if (item?.content?.confirmed) {
		return <Confirmation sender_name={item?.sender_name} item={item} />;
	} else if (!sentByMe) {
		return (
			<Claim
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
	} else {
		return <ClaimTalentView item={item} />;
	}
}
