import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import { formatAmount } from '@utils/formatCurrency';
import useGetAllInvoicesSummary from '@network/useGetAllInvoicesSummary';
import { useInvoicesContext } from './context/InvoicesContext';

interface InvoiceCardProps {
	item: {
		label: string;
		amount: number | null;
		invoicesCount: number;
	};
	center?: boolean;
	borders?: {
		top?: boolean;
		right?: boolean;
		bottom?: boolean;
		left?: boolean;
	};
}

const InvoiceCard = ({ item, center = false, borders = {} }: InvoiceCardProps) => {
	const { styles } = useStyles(stylesheet);
	const cardStyle = [styles.cardContainer, center && styles.cardCenter, borders.top && styles.borderTop, borders.right && styles.borderRight, borders.bottom && styles.borderBottom, borders.left && styles.borderLeft];
	const bodyStyle = [styles.body, center && styles.bodyStyle];

	return (
		<View style={cardStyle}>
			<Text color="regular" size="inputLabel" style={styles.label}>
				{item.label}
			</Text>
			<View style={bodyStyle}>
				<Text color="regular" size="primaryMid" weight="bold">
					{item.amount !== null ? formatAmount(item.amount.toString()) : formatAmount('0')}
				</Text>
				<Text color="muted" size="bodySm">
					for{' '}
					<Text size="bodySm" color="regular" weight="bold">
						{item.invoicesCount}
					</Text>{' '}
					Invoices
				</Text>
			</View>
		</View>
	);
};

export default function InvoicesOverview() {
	const { styles } = useStyles(stylesheet);
	const { filteredProjectId, filteredMonth, filteredYear } = useInvoicesContext();
	const { data: invoices } = useGetAllInvoicesSummary(filteredProjectId ?? undefined, filteredMonth ?? undefined, filteredYear ?? undefined);

	const totalAmountData = {
		label: 'Total Amount',
		amount: invoices?.total_amount_received ? parseFloat(invoices.total_amount_received) : null,
		invoicesCount: invoices?.invoice_count ?? 0,
	};

	const invoiceBreakdownData = [
		{
			label: 'Amount Paid',
			amount: invoices?.total_amount_paid ? parseFloat(invoices.total_amount_paid) : null,
			invoicesCount: invoices?.paid_invoice_count ?? 0,
		},
		{
			label: 'Amount Due',
			amount: invoices?.total_amount_pending ? parseFloat(invoices.total_amount_pending) : null,
			invoicesCount: invoices?.pending_invoice_count ?? 0,
		},
		{
			label: 'Total GST Amount',
			amount: invoices?.total_gst_amount ? parseFloat(invoices.total_gst_amount) : null,
			invoicesCount: invoices?.invoice_count ?? 0,
		},
		{
			label: 'Total GST Credits',
			amount: null, // This data is not provided in the API response
			invoicesCount: invoices?.invoice_count ?? 0,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
				<InvoiceCard item={totalAmountData} borders={{ left: true, right: true }} center={true} />
				<View style={styles.gridContainer}>
					{invoiceBreakdownData.map((item, index) => (
						<InvoiceCard
							key={index}
							item={item}
							borders={{
								top: true,
								right: true,
								bottom: false,
								left: index % 2 === 0,
							}}
						/>
					))}
				</View>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	wrapper: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
	},
	label: {
		lineHeight: theme.lineHeight.custom,
	},
	borderTop: {
		borderTopWidth: theme.borderWidth.slim,
	},
	borderRight: {
		borderRightWidth: theme.borderWidth.slim,
	},
	borderBottom: {
		borderBottomWidth: theme.borderWidth.slim,
	},
	borderLeft: {
		borderLeftWidth: theme.borderWidth.slim,
	},
	cardContainer: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: theme.padding.xs,
		borderColor: theme.colors.borderGray,
		gap: theme.gap.base,
		width: '50%',
	},
	cardCenter: {
		alignItems: 'center',
		width: '100%',
	},
	body: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		gap: theme.gap.steps,
	},
	bodyStyle: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
}));
