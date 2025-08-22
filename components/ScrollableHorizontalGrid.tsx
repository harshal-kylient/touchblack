import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

type ScrollableHorizontalGridType = {
	children: React.ReactNode;
	customStyles?: StyleProp<ViewStyle>;
	gridStyles?: StyleProp<ViewStyle>;
	rows?: 1 | 2 | 3; // Updated to include 3 rows
};

function ScrollableHorizontalGrid({ children, customStyles, gridStyles, rows = 1 }: ScrollableHorizontalGridType) {
	const { styles } = useStyles(stylesheet);

	// Helper function to split children into rows
	const splitChildrenIntoRows = (children: React.ReactNode, numRows: number): React.ReactNode[][] => {
		const childrenArray = React.Children.toArray(children);
		const rowsArray: React.ReactNode[][] = [];
		const itemsPerRow = Math.ceil(childrenArray.length / numRows);

		for (let i = 0; i < numRows; i++) {
			rowsArray.push(childrenArray.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
		}

		return rowsArray;
	};

	if (rows === 1) {
		// Single row implementation
		return (
			<View style={[styles.HorizontalScrollableGridContainer, customStyles]}>
				<ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false} style={[styles.HorizontalScrollableGrid, gridStyles]}>
					<View style={styles.separatorView} />
					{children}
					<View style={styles.separatorView} />
				</ScrollView>
			</View>
		);
	} else {
		const rowsArray = splitChildrenIntoRows(children, rows);
		return (
			<View style={[styles.HorizontalScrollableGridContainer, customStyles]}>
				<ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false} style={[styles.HorizontalScrollableGrid, gridStyles]}>
					<View style={styles.separatorView} />
					<View style={styles.rowContainer}>
						{rowsArray.map((row, rowIndex) => (
							<View key={rowIndex} style={styles.row}>
								{row.map((child, index) => (
									<View key={index} style={styles.columnItem}>
										{child}
									</View>
								))}
							</View>
						))}
					</View>
					<View style={styles.separatorView} />
				</ScrollView>
			</View>
		);
	}
}

export default ScrollableHorizontalGrid;

const stylesheet = createStyleSheet(theme => ({
	HorizontalScrollableGridContainer: {
		width: UnistylesRuntime.screen.width,
	},
	HorizontalScrollableGrid: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	separatorView: {
		width: 16,
	},
	rowContainer: {
		// flexDirection: 'row',
		// backgroundColor: 'pink'
	},
	row: {
		flexDirection: 'row',
		// flexWrap: 'wrap',
		// width: '100%',
	},
	columnItem: {
		// width: '50%',
	},
}));
