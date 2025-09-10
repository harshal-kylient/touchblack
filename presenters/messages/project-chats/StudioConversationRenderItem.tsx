import { useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import moment from 'moment';
import { formatTimestampForDay } from '@utils/formatTimestampForDay';
import { Text } from '@touchblack/ui';
import Wrapper from './Wrapper';
import IMessageItem from '@models/entities/IMessageItem';
import NormalMessage from './NormalMessage';
import StudioTemplateMessage from './StudioTemplateMessage';
import StudioNegotiationMessage from './StudioNegotiationMessage';
import StudioClaimMessage from './StudioClaimMessage';
import StudioInvoiceMessage from './StudioInvoiceMessage';
import StudioClaimCompleteMessage from './StudioClaimCompleteMessage';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import useSentByMe from './useSentByMe';

interface IProps {
	item: IMessageItem;
	status: EnumStudioStatus;
	index: number;
	party1_id: UniqueId;
	party2_id: UniqueId;
	project_id: UniqueId;
	last_negotiation_id: UniqueId;
	last_negotiation_status: 'pending' | 'confirmed';
	conversation_id: UniqueId;
	data: IMessageItem[];
}

export default function StudioConversationRenderItem({ item, status, party1_id, party2_id, index, conversation_id, project_id, data, last_negotiation_id, last_negotiation_status }: IProps) {
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
				return <StudioTemplateMessage party1_id={party1_id} party2_id={party2_id} status={status} conversation_id={conversation_id} item={item} project_id={project_id} />;
			case 'negotiation':
				return <StudioNegotiationMessage last_negotiation_status={last_negotiation_status} last_negotiation_id={last_negotiation_id} conversation_id={conversation_id} item={item} />;
			case 'claim':
				return <StudioClaimMessage last_negotiation_status={last_negotiation_status} last_negotiation_id={last_negotiation_id} item={item} />;
			case 'notification':
				return <StudioInvoiceMessage project_id={project_id} item={item} />;
			case 'opted_out':
				return <NormalMessage item={item} />;
			case 'project_completion':
				return <StudioClaimCompleteMessage project_id={project_id} conversation_id={conversation_id} item={item} />;
			default:
				return <NormalMessage item={item} />;
		}
	}, [status, conversation_id, item, project_id]);

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
