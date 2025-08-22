import { View } from 'react-native';
import { useMemo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Accordion, Text } from '@touchblack/ui';
import { FlashList } from '@shopify/flash-list';

// import { InvoiceProjectItemHeader } from './InvoiceProjectItemHeader';
import InvoiceItem from './InvoiceItem';
// import { useAuth } from '@presenters/auth/AuthContext';
import useGetInvoices from '@network/useGetInvoices';
import LargeGridPlaceholder from '@components/loaders/LargeGridPlaceholder';
import { useInvoicesContext } from './context/InvoicesContext';

export default function InvoicesHistory() {
	const { styles } = useStyles(stylesheet);
	const { filteredProjectId, filteredMonth, filteredYear } = useInvoicesContext();
	// const { loginType } = useAuth();
	// const userType = loginType === 'talent' ? 'talent' : 'producer';

	const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetInvoices(filteredProjectId ?? undefined, filteredMonth ?? undefined, filteredYear ?? undefined);

	const groupedInvoices = useMemo(() => {
		if (!data) return {};
		return data.reduce((acc, invoice) => {
			if (!acc[invoice.project_id]) {
				acc[invoice.project_id] = {
					projectName: invoice.project_name,
					invoices: [],
					film_type: invoice.film_type,
				};
			}
			acc[invoice.project_id].invoices.push(invoice);
			return acc;
		}, {});
	}, [data]);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<LargeGridPlaceholder />
			</View>
		);
	}

	if (Object.keys(groupedInvoices).length === 0) {
		return (
			<View style={styles.container}>
				<Text size="secondary" color="regular" style={styles.title}>
					History
				</Text>
				<Text size="secondary" color="muted" style={styles.title}>
					No invoices found
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text size="secondary" color="regular" style={styles.title}>
				History
			</Text>
			<View style={styles.accordionContainer}>
				{Object.keys(groupedInvoices).map((projectId, projectIndex) => {
					return (
						<Accordion
							key={projectIndex}
							title={groupedInvoices[projectId].projectName + ' ' + '(' + groupedInvoices[projectId].film_type + ')'}
							customStyles={styles.accordion}
							header={
								// 	userType === 'producer' ?
								// <InvoiceProjectItemHeader
								// 	title={groupedInvoices[projectId].projectName}
								// 	filmType={'to be added'}
								// 	index={projectIndex}
								// /> :
								null
							}>
							<FlashList
								data={groupedInvoices[projectId].invoices}
								renderItem={({ item }) => <InvoiceItem item={item} showCheckbox={false} projectIndex={projectIndex} />}
								estimatedItemSize={100}
								onEndReached={() => {
									if (hasNextPage && !isFetchingNextPage) {
										fetchNextPage();
									}
								}}
								onEndReachedThreshold={0.5}
							/>
						</Accordion>
					);
				})}
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		marginTop: theme.margins.xxxl,
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.xxl,
	},
	title: {
		paddingHorizontal: theme.padding.base,
	},
	accordionContainer: {
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
	},
	accordion: {
		borderColor: theme.colors.borderGray,
		width: 'auto',
	},
}));
