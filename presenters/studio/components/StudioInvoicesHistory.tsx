import { Pressable, View } from 'react-native';
import { useCallback, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';

const TABS = [
	{ id: 0, title: 'Amount Due' },
	{ id: 1, title: 'Amount Received' },
] as const;

type TabType = (typeof TABS)[number]['title'];

// due_date: string;
// id: string;
// invoice_date: string;
// invoice_number: string;
// invoice_status: string;
// production_name: string;
// project_id: string;
// project_name: string;
// total_amount: string;

const invoices = [
	{
		projectName: 'Project 1',
		film_type: 'Film Type 1',
		invoices: [
			{
				invoice_status: 'due',
				amount_paid: '1000',
				amount_pending: '500',
				amount_received: '1500',
				gst_amount: '100',
				due_date: '2021-01-01',
				id: '1',
				invoice_date: '2021-01-01',
				invoice_number: '1',
				production_name: 'Production 1',
				project_id: '1',
				project_name: 'Project 1',
				total_amount: '1500',
			},
			{
				invoice_status: 'paid',
				amount_paid: '1000',
				amount_pending: '500',
				amount_received: '1500',
				gst_amount: '100',
				due_date: '2021-01-01',
				id: '2',
				invoice_date: '2021-01-01',
				invoice_number: '2',
				production_name: 'Production 2',
				project_id: '2',
				project_name: 'Project 2',
				total_amount: '1500',
			},
		],
	},
	{
		projectName: 'Project 3',
		invoices: [
			{
				invoice_status: 'paid',
				amount_paid: '1000',
				amount_pending: '500',
				amount_received: '1500',
				gst_amount: '100',
				due_date: '2021-01-01',
				id: '3',
				invoice_date: '2021-01-01',
				invoice_number: '3',
				production_name: 'Production 3',
				project_id: '3',
				project_name: 'Drake Vahhi',
				total_amount: '1500',
			},
		],
	},
];

import InvoiceItem from '@presenters/invoices/InvoiceItem';
import SearchInput from '@components/SearchInput';

export default function StudioInvoicesHistory() {
	const { styles, theme } = useStyles(stylesheet);
	const [activeTab, setActiveTab] = useState<TabType>('Amount Due');

	const handleTabSwitch = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, []);

	const renderTab = useCallback(
		({ id, title }: (typeof TABS)[number]) => (
			<Pressable key={id} onPress={() => handleTabSwitch(title)} style={styles.tab(activeTab === title)}>
				<Text size="button" numberOfLines={1} color={activeTab === title ? 'primary' : 'regular'}>
					{title}
				</Text>
				<View style={styles.absoluteContainer(activeTab === title)} />
			</Pressable>
		),
		[activeTab, handleTabSwitch, styles],
	);

	return (
		<View style={styles.container}>
			<Text size="secondary" color="regular" style={styles.title}>
				Invoices
			</Text>
			<View style={{ flex: 1, backgroundColor: theme.colors.black }}>
				<View style={styles.tabContainer}>{TABS.map(renderTab)}</View>
				<SearchInput placeholderText="Search Invoices..." />
				<View style={styles.accordionContainer}>
					{invoices.map((projectId, projectIndex) => {
						return <FlashList data={projectId.invoices} renderItem={({ item }) => <InvoiceItem item={item} showCheckbox={false} projectIndex={projectIndex} />} estimatedItemSize={100} onEndReachedThreshold={0.5} />;
					})}
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
	title: {
		paddingHorizontal: theme.padding.base,
		marginBottom: theme.margins.xxl,
	},
	accordionContainer: {
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.black,
	},
	accordion: {
		borderColor: theme.colors.borderGray,
		width: 'auto',
	},

	tabContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingHorizontal: theme.padding.xs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tab: (active: boolean) => ({
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: active ? theme.colors.black : theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: active ? theme.colors.borderGray : theme.colors.transparent,
		paddingVertical: theme.padding.xs,
		position: 'relative',
	}),
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
}));
