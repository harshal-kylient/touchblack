import { useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import moment from 'moment';
import { formatTimestampForDay } from '@utils/formatTimestampForDay';
import { Text } from '@touchblack/ui';
import Wrapper from './Wrapper';
import NegotiationMessage from './NegotiationMessage';
import IMessageItem from '@models/entities/IMessageItem';
import TemplateMessage from './TemplateMessage';
import NormalMessage from './NormalMessage';
import ClaimMessage from './ClaimMessage';
import InvoiceMessage from './InvoiceMessage';
import ClaimCompleteMessage from './ClaimCompleteMessage';
import EnumProjectStatus from '@models/enums/EnumProjectStatus';
import PaymentMessage from './PaymentMessage';
import useSentByMe from './useSentByMe';


interface IProps {
	item: IMessageItem;
	status: EnumProjectStatus;
	index: number;
	party1_id: UniqueId;
	party2_id: UniqueId;
	project_id: UniqueId;
	conversation_id: UniqueId;
	last_negotiation_id: UniqueId;
	last_negotiation_status: 'pending' | 'confirmed';
	data: IMessageItem[];
	project_invitation_id: UniqueId;
}

export default function ProjectConversationRenderItem({ item, last_negotiation_status, last_negotiation_id, status, party1_id, party2_id, index, project_invitation_id, conversation_id, project_id, data }: IProps) {
	const { styles } = useStyles(stylesheet);
	const sentByMe = useSentByMe(item);

	const showTimestamp = useMemo(() => {
		if (index > 0) {
			return moment(data[index - 1]?.created_at).format('YYYY-MM-DD') !== moment(item?.created_at).format('YYYY-MM-DD');
		}
		return true;
	}, [index, data, item]);

	const renderMessage = useMemo(() => {
		switch (item?.message_type) {
			case 'template':
				return <TemplateMessage party1_id={party1_id} party2_id={party2_id} status={status} project_invitation_id={project_invitation_id} conversation_id={conversation_id} item={item} project_id={project_id} />;
			case 'negotiation':
				return <NegotiationMessage last_negotiation_id={last_negotiation_id} last_negotiation_status={last_negotiation_status} conversation_id={conversation_id} item={item} />;
			case 'claim':
				return <ClaimMessage last_negotiation_id={last_negotiation_id} last_negotiation_status={last_negotiation_status} item={item} />;
			case 'notification':
				return <InvoiceMessage project_id={project_id} item={item} conversation_id={conversation_id} />;
			case 'opted_out':
				return <NormalMessage item={item} />;
			case 'project_completion':
				return <ClaimCompleteMessage status={status} project_id={project_id} conversation_id={conversation_id} item={item} />;
			case 'payment':
				return <PaymentMessage status={status} project_id={project_id} conversation_id={conversation_id} item={item} />;
			default:
				return <NormalMessage item={item} />;
		}
	}, [status, project_invitation_id, conversation_id, item, project_id]);
	return (
		<>
			{showTimestamp && (
				<View style={styles.timestampContainer}>
					<View style={styles.timestampDivider} />
					<Text size="bodyMid" color="regular">
						{formatTimestampForDay(item?.created_at)}
					</Text>
					<View style={styles.timestampDivider} />
				</View>
			)}
			<Wrapper sentByMe={sentByMe}>{renderMessage}</Wrapper>
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	timestampContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.sm,
	},
	timestampDivider: {
		height: 0.5,
		flex: 1,
		backgroundColor: theme.colors.muted,
	},
}));
