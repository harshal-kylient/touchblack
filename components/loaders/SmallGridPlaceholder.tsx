import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const SmallGridPlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);

	const renderSkeletonItems = () => {
		const items = [];
		for (let i = 0; i < 4; i++) {
			items.push(
				<SkeletonPlaceholder.Item flexDirection="column" borderLeftWidth={1} borderRightWidth={1} borderColor={'#555555'} paddingHorizontal={21} paddingVertical={10} key={i}>
					<SkeletonPlaceholder.Item width={48} height={48} />
					<SkeletonPlaceholder.Item width={48} height={8} marginTop={18} />
				</SkeletonPlaceholder.Item>,
			);
		}
		return items;
	};

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item marginHorizontal={16} flexDirection="row">
					{renderSkeletonItems()}
				</SkeletonPlaceholder.Item>
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
}));

export default SmallGridPlaceholder;
