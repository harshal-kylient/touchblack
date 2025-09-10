import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Table } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.black,
	},
}));

const BusinessDetails = () => {
	const { styles } = useStyles(stylesheet);

	const tableData = [
		['GST TIN No.', '22 AAAAA0000A 1 Z 5'],
		['PAN No.', 'AFZPK7190K'],
		['Bio', 'We are the face of future film and television Industry.'],
		['Business Type', 'Type of Business'],
		['Email ID', 'dharma.production@gmail.com'],
	];

	return (
		<View style={styles.container}>
			<Table tableBorderColor={darkTheme.colors.borderGray} tableBorderWidth={darkTheme.borderWidth.bold} tableDataRow={tableData} />
		</View>
	);
};

export default BusinessDetails;
