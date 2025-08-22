import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FilterList } from '@touchblack/icons';

import Header from '@components/Header';
import InvoicesOverview from './InvoicesOverview';
import InvoicesHistory from './InvoicesHistory';
import { Button } from '@touchblack/ui';
import useInvoicesLogic from './useInvoicesLogic';
import Upcoming from '@components/errors/Upcoming';

function Invoices() {
	const { styles } = useStyles(stylesheet);
	const { handleFilterPress, handleUploadPOP, handleReset, showFooter } = useInvoicesLogic();

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<Header
					name="Invoices"
					children={
						<Pressable onPress={handleFilterPress}>
							<FilterList size="24" />
						</Pressable>
					}
				/>
				{/* <InvoicesOverview />
				<InvoicesHistory /> */}
				<View style={styles.upcomingContainer}>
					<Upcoming />
				</View>
			</ScrollView>
			{/* {showFooter && (
				<View style={styles.footer}>
					<Button type="secondary" textColor="regular" style={[styles.button, styles.secondaryButton]} onPress={handleReset}>
						Cancel
					</Button>
					<Button type="primary" style={styles.button} onPress={handleUploadPOP}>
						Upload POP
					</Button>
				</View>
			)} */}
		</SafeAreaView>
	);
}

export default Invoices;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	upcomingContainer: { flex: 1, backgroundColor: theme.colors.black, marginTop: theme.margins.base * 5 },
	footer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
	secondaryButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
