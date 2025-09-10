import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const TablePlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);
	const renderSkeletonItems = () => {
		const items = [];
		for (let i = 0; i < 9; i++) {
			items.push(
				<View style={styles.listContainer} key={i}>
					<SkeletonPlaceholder.Item flexDirection="row">
						<SkeletonPlaceholder.Item width={76} height={16} marginHorizontal={16} marginVertical={20} />
						<View style={styles.textWrapper}>
							<SkeletonPlaceholder.Item width={i % 2 ? 213 : 86} height={16} marginHorizontal={16} marginVertical={20} />
						</View>
					</SkeletonPlaceholder.Item>
				</View>,
			);
		}
		return items;
	};

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="column">{renderSkeletonItems()}</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: 0.8,
		borderBottomWidth: 0.8,
		marginTop: theme.margins.xxl,
	},
	listContainer: {
		marginLeft: theme.margins.base,
		borderLeftWidth: 1,
		borderBottomWidth: 1,
		borderColor: theme.colors.borderGray,
	},
	textWrapper: {
		borderLeftWidth: 1,
		borderColor: 'white',
	},
}));

export default TablePlaceholder;
