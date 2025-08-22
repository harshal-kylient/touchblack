import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FilterList } from '@touchblack/icons';
import useInvoicesLogic from '@presenters/invoices/useInvoicesLogic';
import InvoicesOverview from '@presenters/invoices/InvoicesOverview';
import InvoicesHistory from '@presenters/invoices/InvoicesHistory';
import ManagerTalentDropdown from './ManagerTalentDropdown';

function ManagerInvoices() {
	const { styles } = useStyles(stylesheet);
	const { handleFilterPress, handleUploadPOP, handleReset, showFooter } = useInvoicesLogic();

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.subContainer}>
					<ManagerTalentDropdown charecterLength={25} />
					<Pressable onPress={handleFilterPress}>
						<FilterList size="24" />
					</Pressable>
				</View>
				<InvoicesOverview />
				<InvoicesHistory />
			</ScrollView>
		</SafeAreaView>
	);
}

export default ManagerInvoices;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	subContainer: { zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', position: 'relative', backgroundColor: theme.colors.black, paddingHorizontal: theme.padding.base, width: '100%', paddingBottom: theme.padding.sm, paddingTop: theme.padding.sm },
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
