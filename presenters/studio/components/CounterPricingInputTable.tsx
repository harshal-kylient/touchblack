import React from 'react';
import { View, TextInput } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

interface ServiceDaysItem {
	service: string;
	days: number | string;
}

interface PriceListItem {
	service: string;
	amountPerShift: number | string;
	days: number | string;
	total: number | string;
}

interface ServiceDaysTableProps {
	data: ServiceDaysItem[];
}

interface PriceListTableProps {
	data: PriceListItem[];
	total: number | string;
	title?: string;
}

export const CounterServiceDaysTable: React.FC<ServiceDaysTableProps> = ({ data }) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.tableContainer(false)}>
			<View style={[styles.tableRow(), { borderTopWidth: theme.borderWidth.slim }]}>
				<View style={styles.tableHeading2}>
					<Text color="primary" size="bodyMid">
						Service
					</Text>
				</View>
				{data?.map((item, index) => (
					<View style={styles.tableContent2} key={`service-${index}`}>
						<Text color="regular" size="bodyMid">
							{item.service}
						</Text>
					</View>
				))}
			</View>

			<View style={styles.tableRow(false)}>
				<View style={styles.tableHeading2}>
					<Text color="primary" size="bodyMid">
						No. of days
					</Text>
				</View>
				{data?.map((item, index) => (
					<View style={styles.tableContent2} key={`days-${index}`}>
						<Text color="regular" size="bodyMid">
							{item.days}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export const CounterPriceListTable: React.FC<PriceListTableProps> = ({ prices, setPrices, total, title = 'Price List' }) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.tableContainer(false)}>
			<View style={styles.tableHeader}>
				<Text color="regular" size="bodyBig">
					{title}
				</Text>
			</View>

			<View style={styles.tableRow()}>
				<View style={styles.tableHeading}>
					<Text color="primary" size="bodyMid">
						Service
					</Text>
				</View>
				<View style={styles.tableContent}>
					<Text color="primary" size="bodyMid">
						Amt./shift
					</Text>
				</View>
				<View style={styles.tableContent}>
					<Text color="primary" size="bodyMid">
						Total
					</Text>
				</View>
			</View>

			{Object.keys(prices)?.map((item, index) => (
				<View style={[styles.tableRow(), { borderRightWidth: theme.borderWidth.slim }]} key={`row-${index}`}>
					<View style={styles.tableHeading}>
						<Text color="regular" size="bodyMid">
							{item}
						</Text>
					</View>
					<View style={styles.tableContent}>
						<Text size="bodyMid" color="regular">
							{prices[item]?.price_shift}
						</Text>
					</View>
					<View style={styles.tableContent}>
						<TextInput value={String(prices?.[item]?.total || '')} onChangeText={value => setPrices(prev => ({ ...prev, [item]: { ...prev[item], total: value } }))} style={styles.input} />
					</View>
				</View>
			))}

			<View style={{ flexDirection: 'row', borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<View style={styles.tableContent}>
					<Text color="regular" size="primarySm" style={styles.tableHeading1}>
						Total
					</Text>
				</View>
				<View style={styles.totalAmountView}>
					<Text color="regular" size="primarySm" style={styles.totalAmountText}>
						{total}
					</Text>
				</View>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tableContainer: (border: boolean = true) => ({
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		borderTopWidth: border ? theme.borderWidth.slim : 0,
		borderBottomWidth: theme.borderWidth.bold,
		marginTop: theme.margins.base,
	}),
	totalAmountText: {
		padding: theme.padding.base,
		borderColor: theme.colors.borderGray,
		alignSelf: 'flex-end',
		fontWeight: theme.fontWeight.bold,
	},
	totalHeadingRow: {
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.base,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeading1: {
		fontWeight: theme.fontWeight.bold,
		color: theme.colors.success,
	},
	tableContent1: {
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.base * 1.65,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
	},
	totalAmountView: {
		flex: 1,
	},
	tableHeader: {
		paddingVertical: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableRow: (border: boolean = true) => ({
		flexDirection: 'row',
		borderBottomWidth: border ? theme.borderWidth.slim : 0,
		borderColor: theme.colors.borderGray,
	}),
	tableHeading2: {
		minWidth: '25%',
		maxWidth: '25%',
		alignItems: 'center',
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.sm,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent2: {
		minWidth: '25%',
		maxWidth: '25%',
		alignItems: 'center',
		paddingHorizontal: theme.padding.sm,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
	},
	tableHeading: {
		minWidth: '33.33%',
		maxWidth: '33.33%',
		alignItems: 'center',
		paddingVertical: theme.padding.base,
		paddingHorizontal: theme.padding.sm,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		minWidth: '33.33%',
		maxWidth: '33.33%',
		alignItems: 'center',
		paddingHorizontal: theme.padding.sm,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
	},
	input: {
		flex: 1,
		width: '100%',
		textAlign: 'right',
		color: theme.colors.typography,
		fontFamily: theme.fontFamily.cgMedium,
	},
	totalRow: {
		borderTopWidth: 2,
		borderColor: theme.colors.borderGray,
	},
}));
