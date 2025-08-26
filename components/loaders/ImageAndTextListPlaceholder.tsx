import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const ImageAndTextListPlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);
	const renderSkeletonItems = () => {
		const items = [];
		for (let i = 0; i < 3; i++) {
			items.push(
				<View style={styles.listContainer} key={i}>
					<SkeletonPlaceholder.Item flexDirection="row" gap={16}>
						<SkeletonPlaceholder.Item width={56} height={56} />
						<SkeletonPlaceholder.Item width={119} height={16} marginVertical={20} />
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

export default ImageAndTextListPlaceholder;
