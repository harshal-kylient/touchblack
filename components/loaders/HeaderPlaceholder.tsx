import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const HeaderPlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center">
					<SkeletonPlaceholder.Item width={109} height={16} margin={16} />
					<SkeletonPlaceholder.Item flexDirection="row" borderLeftWidth={1} borderBottomWidth={1} borderColor={'#555555'}>
						<SkeletonPlaceholder.Item width={24} height={24} margin={12} />
						<SkeletonPlaceholder.Item flexDirection="row" borderLeftWidth={1} borderColor={'#555555'} />
						<SkeletonPlaceholder.Item width={48} height={48} />
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: 0.8,
	},
}));

export default HeaderPlaceholder;
