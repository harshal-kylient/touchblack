import { memo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import { FieldItem } from './FieldItem';
import { formatAmount } from '@utils/formatCurrency';
import IMessageItem from '@models/entities/IMessageItem';
import useSentByMe from './useSentByMe';

const ClaimTalentView = memo(({ item }: { item: IMessageItem }) => {
	const { styles, theme } = useStyles(stylesheet);
	const sentByMe = useSentByMe(item);

	return (
		<>
			<View style={styles.header}>
				<Text size="cardHeading" color="muted">
					You have claimed
				</Text>
				<Text size="cardHeading" weight="bold" color="regular">
					{formatAmount(item?.content?.negotiation?.amount)}/-
				</Text>
			</View>
			<View>
				<FieldItem orientation="row" label="Payment Terms:" value={item?.content?.negotiation?.payment_terms ? `${item?.content?.negotiation?.payment_terms} days` : '-'} style={styles.field} />
				<FieldItem orientation="row" label="Cancellation Charges:" style={styles.field} value={`${formatAmount(item?.content?.negotiation?.cancellation_charges)}`} />
				<FieldItem orientation="row" label="Note:" style={styles.field} value={item?.content?.negotiation?.comments} />
			</View>
			<View style={{ borderTopWidth: theme.borderWidth.slim, borderColor: '#fff4' }}>
				<Text style={{ color: theme.colors.success, fontWeight: 'bold', paddingVertical: theme.padding.xxs, paddingHorizontal: theme.padding.base }} textAlign={sentByMe ? 'right' : 'left'} size="bodyMid">
					{item?.content?.sender_name}
				</Text>
			</View>
		</>
	);
});

const stylesheet = createStyleSheet(theme => ({
	header: {
		minWidth: '100%',
		gap: theme.gap.steps,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#28251e',
		padding: theme.padding.xs,
		alignItems: 'center',
	},
	field: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: '#fff4',
		alignItems: 'center',
	},
}));

export default ClaimTalentView;
