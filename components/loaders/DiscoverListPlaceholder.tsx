import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const DiscoverListPlaceholder: React.FC<{ numberOfItems?: number }> = ({ numberOfItems = 3 }) => {
	const { styles } = useStyles(stylesheet);
	const renderSkeletonItems = () => {
		const items = [];
		for (let i = 0; i < numberOfItems; i++) {
			items.push(
				<View style={styles.listContainer} key={i}>
					<SkeletonPlaceholder.Item flexDirection="row">
						<SkeletonPlaceholder.Item width={64} height={64} />
						<View style={styles.textWrapper}>
							<View>
								<SkeletonPlaceholder.Item width={86} height={16} marginTop={11} />
								<SkeletonPlaceholder.Item width={48} height={8} marginTop={14} />
							</View>
							<View style={styles.iconWrapper}>
								<SkeletonPlaceholder.Item width={24} height={24} />
								<SkeletonPlaceholder.Item width={24} height={24} />
							</View>
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
		flexDirection: 'row',
		paddingHorizontal: theme.padding.base,
		justifyContent: 'space-between',
		flex: 1,
	},
	iconWrapper: {
		flexDirection: 'row',
		marginVertical: 20,
		gap: theme.gap.base,
	},
}));

export default DiscoverListPlaceholder;
