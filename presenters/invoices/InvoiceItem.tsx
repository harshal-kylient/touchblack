import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text } from '@touchblack/ui';
import CheckBox from '@components/Checkbox';
import { useInvoicesContext } from './context/InvoicesContext';
import useDownloadInvoice from '@network/useDownloadInvoice';

interface InvoiceItemProps {
	item: InvoiceItem;
	showCheckbox: boolean;
	projectIndex: number;
}

interface InvoiceItem {
	due_date: string;
	id: string;
	invoice_date: string;
	invoice_number: string;
	invoice_status: string;
	production_name: string;
	project_id: string;
	project_name: string;
	total_amount: string;
}

const statusColors = {
	paid: 'success',
	pending: 'destructive',
} as const;

const RowItem = React.memo(({ label, value }: { label: string; value: string }) => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.rowItem}>
			<Text color="muted" size="bodySm">
				{label}
			</Text>
			<Text color="regular" weight="bold" size="inputLabel">
				{value}
			</Text>
		</View>
	);
});

const StatusText = React.memo(({ status }: { status: string }) => {
	const { theme } = useStyles(stylesheet);
	const color = theme.colors[statusColors[status]];

	let text = status === 'paid' ? 'Amount Paid' : 'Amount Due';

	return (
		<Text size="bodySm" style={{ color, flexGrow: 1, textAlign: 'right' }}>
			{text}
		</Text>
	);
});

export default function InvoiceItem({ item, showCheckbox, projectIndex }: InvoiceItemProps) {
	const { styles } = useStyles(stylesheet);
	const { state, dispatch } = useInvoicesContext();

	const isSelected = useMemo(() => state.selectedProject === projectIndex && state.selectedInvoices.includes(item.id), [state.selectedProject, state.selectedInvoices, projectIndex, item.id]);

	const { refetch: downloadInvoice, isLoading } = useDownloadInvoice(item.id);

	const handleDownloadInvoice = useCallback(async () => {
		// const res = await downloadInvoice();
	}, [downloadInvoice]);

	const infoRows = useMemo(
		() => [
			{ label: 'Invoice Date', value: item.invoice_date },
			{ label: 'Invoice Number', value: item.invoice_number },
			{ label: 'Due Date', value: item.due_date },
			{ label: 'Project Amount', value: `₹ ${item.total_amount}` },
		],
		[item],
	);

	const handleSelect = useCallback(() => {
		if (state.selectedProject !== projectIndex) {
			dispatch({ type: 'SELECT_PROJECT', payload: projectIndex });
			dispatch({ type: 'SELECT_INVOICE', payload: item.id });
		} else {
			dispatch({
				type: isSelected ? 'DESELECT_INVOICE' : 'SELECT_INVOICE',
				payload: item.id,
			});
		}
	}, [state.selectedProject, projectIndex, item.id, isSelected, dispatch]);

	if (isLoading)
		return (
			<View style={styles.marginContainer}>
				<Text size="bodyBig">Loading...</Text>
			</View>
		);

	return (
		<View style={styles.marginContainer}>
			<View style={styles.invoiceItemContainer}>
				<View style={styles.header}>
					<View style={styles.row}>
						<View style={[styles.rowItem, { flexDirection: 'row' }]}>
							{showCheckbox && <CheckBox value={isSelected} onChange={handleSelect} />}
							<View style={styles.rowItem}>
								<Text color="regular" weight="bold" size="bodyBig">
									{item.project_name}
								</Text>
								<Text color="regular" size="bodySm">
									{item.production_name}
								</Text>
							</View>
						</View>
						<View style={styles.rowCenterItem}>
							<StatusText status={item.invoice_status} />
						</View>
					</View>
				</View>
				<View style={styles.body}>
					<View style={styles.row}>
						{infoRows.slice(0, 2).map((row, index) => (
							<RowItem key={index} label={row.label} value={row.value} />
						))}
					</View>
					<View style={styles.row}>
						{infoRows.slice(2, 4).map((row, index) => (
							<RowItem key={index} label={row.label} value={row.value} />
						))}
					</View>
				</View>
				<View style={styles.footer}>
					<Button type="primary" style={styles.button} onPress={() => handleDownloadInvoice(item.id)}>
						Download Invoice
					</Button>
				</View>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	marginContainer: {
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
		borderTopWidth: theme.borderWidth.slim,
		marginBottom: theme.margins.base,
	},
	invoiceItemContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
		marginHorizontal: theme.margins.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
	},
	header: {
		padding: theme.padding.xs,
		gap: theme.gap.xxs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	body: {
		padding: theme.padding.xs,
		gap: theme.gap.xs,
	},
	footer: {
		flexDirection: 'row',
	},
	secondaryButton: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	rowItem: {
		gap: theme.gap.steps,
		flex: 1,
	},
	rowCenterItem: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
}));
