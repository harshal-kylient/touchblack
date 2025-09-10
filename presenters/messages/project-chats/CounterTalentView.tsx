import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text } from '@touchblack/ui';

import Wrapper from './Wrapper';
import { FieldItem } from './FieldItem';
import { INegotiation } from '@models/entities/IMessages';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { formatAmount } from '@utils/formatCurrency';

export default function CounterTalentView({ onCounter, onConfirm, negotiation }: { onCounter?: () => void; onConfirm?: () => void; negotiation: INegotiation }) {
	const { styles } = useStyles(stylesheet);
	const { amount, comments, payment_terms } = negotiation;

	const handleCounter = () => {
		if (onCounter) {
			onCounter();
		} else {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.CounterOffer,
					data: {
						negotiation: negotiation,
					},
				},
			});
		}
	};

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		} else {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.Success,
					data: {
						header: 'Wohoo !',
						text: `You confirmed the project at ${formatAmount(amount)}/-`,
					},
				},
			});
		}
	};

	return (
		<Wrapper sender="Talent" readReceipt="12:06">
			<View style={styles.body}>
				<FieldItem orientation="row" label="Previously Claimed Amount (GST Excl.)" value={formatAmount(amount)} style={[styles.field, { borderTopWidth: 0 }]} />
				<View style={styles.currentClaim}>
					<Text size="bodyBig" style={styles.currentClaimText} color="muted">
						Vincent claimed
					</Text>
					<Text size="cardHeading" weight="bold" color="regular">
						{formatAmount(amount)}/-{' '}
					</Text>
				</View>
				<FieldItem orientation="row" label={'Payment Terms'} value={payment_terms ? `${payment_terms} days` : '-'} style={styles.field} />
				<FieldItem orientation="row" label={`Note: ${comments}`} style={styles.field} value={null} />
			</View>
			<View style={styles.footer}>
				<Button type="secondary" textColor="regular" onPress={handleCounter} style={styles.secondaryButton}>
					Counter
				</Button>
				<Button type="primary" onPress={handleConfirm} style={styles.button}>
					Confirm
				</Button>
			</View>
		</Wrapper>
	);
}

const stylesheet = createStyleSheet(theme => ({
	currentClaim: {
		gap: theme.gap.steps,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundDarkBlack,
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
	footer: {
		flexDirection: 'row',
		flex: 1,
		borderTopWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	button: {
		flex: 1,
	},
}));
