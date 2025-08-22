import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import Wrapper from './Wrapper';
import { FieldItem } from './FieldItem';
import { INegotiation } from '@models/entities/IMessages';
import { formatAmount } from '@utils/formatCurrency';

export default function Counter({ negotiation }: { negotiation: INegotiation }) {
	const { styles } = useStyles(stylesheet);
	const { amount, comments, payment_terms } = negotiation;

	return (
		<Wrapper sender="Producer" readReceipt="12:06">
			<View style={styles.body}>
				<FieldItem orientation="row" label="Previously Claimed Amount (GST Excl.)" value={formatAmount(amount)} style={[styles.field, { borderTopWidth: 0 }]} />
				<View style={styles.currentClaim}>
					<Text size="bodyBig" style={styles.currentClaimText} color="muted">
						You have claimed
					</Text>
					<Text size="cardHeading" weight="bold" color="regular">
						{formatAmount(amount)}/-{' '}
					</Text>
				</View>
				<FieldItem orientation="row" label={'Payment Terms'} value={payment_terms ? `${payment_terms} days` : '-'} style={styles.field} />
				<FieldItem orientation="row" label={`Note: ${comments}`} style={styles.field} value={null} />
			</View>
		</Wrapper>
	);
}

const stylesheet = createStyleSheet(theme => ({
	currentClaim: {
		gap: theme.gap.steps,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#28251e',
		padding: theme.padding.xs,
		borderColor: '#fff4',
		borderTopWidth: theme.borderWidth.slim,
		alignItems: 'center',
	},
	currentClaimText: {},
	body: {
		maxWidth: '100%',
	},
	field: {
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.xs,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: '#fff4',
		alignItems: 'center',
	},
}));
