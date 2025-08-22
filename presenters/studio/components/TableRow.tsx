import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

interface TableRowProps {
	heading: string | null;
	text: string | null;
}
interface TableMultipleProps {
	heading: string | null;
	text1: string | null;
	text2: string | null;
	text3: string | null;
}
export const TableRow: React.FC<TableRowProps> = ({ heading, text }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableHeading}>
				<Text color="muted" size="bodySm">
					{heading}
				</Text>
			</View>
			<View style={styles.tableContent}>
				<Text color="regular" size="bodySm">
					{text}
				</Text>
			</View>
		</View>
	);
};
export const TableColumn: React.FC<TableRowProps> = ({ heading, text }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableColumn}>
			<View style={styles.tableHeading}>
				<Text color="regular" size="bodySm">
					{heading}
				</Text>
			</View>
			<View style={styles.tableContent}>
				<Text color="regular" size="bodySm">
					{text}
				</Text>
			</View>
		</View>
	);
};

export const TableRowTopHeading: React.FC<TableRowProps> = ({ heading, text }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableHeading}>
				<Text color="primary" size="bodySm">
					{heading}
				</Text>
			</View>
			<View style={styles.tableContent}>
				<Text color="primary" size="bodySm">
					{text}
				</Text>
			</View>
		</View>
	);
};
export const TableMutlipleColumn: React.FC<TableMultipleProps> = ({ heading, text1, text2, text3 }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableContentColumn}>
				<Text color="regular" size="bodySm">
					{text2}
				</Text>
			</View>
			<View style={styles.tableContentColumn}>
				<Text color="regular" size="bodySm">
					{text3}
				</Text>
			</View>
		</View>
	);
};
export const TableMutlipleColumnHeading: React.FC<TableMultipleProps> = ({ heading, text1, text2, text3 }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableHeadingColumn1}>
				<Text color="primary" size="bodySm" textAlign="center">
					{heading}
				</Text>
			</View>
			<View style={styles.tableContentColumn}>
				<Text color="primary" size="bodySm" textAlign="center">
					{text1}
				</Text>
			</View>
			<View style={styles.tableContentColumn}>
				<Text color="primary" size="bodySm" textAlign="center">
					{text2}
				</Text>
			</View>
			<View style={styles.tableContentColumn}>
				<Text color="primary" size="bodySm" textAlign="center">
					{text3}
				</Text>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableColumn: {
		flexDirection: 'column',
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeading: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		minWidth: '40%',
		maxWidth: '40%',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContent: {
		minWidth: '60%',
		maxWidth: '60%',
		backgroundColor: theme.colors.black,
		flex: 1,
		padding: theme.padding.sm,
		borderTopWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeadingColumn: {
		minWidth: 80,
		maxWidth: 80,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableHeadingColumn1: {
		minWidth: 85,
		maxWidth: 85,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	tableContentColumn: {
		flex: 1,
		padding: theme.padding.sm,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
