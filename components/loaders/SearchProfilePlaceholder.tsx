import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const SearchProfilePlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="column" marginLeft={16} borderLeftWidth={1} borderRightWidth={1} borderColor={'#555555'} height={358} width={358}>
					<SkeletonPlaceholder.Item width={358} height={297} />
					<View style={styles.subContainer}>
						<View>
							<SkeletonPlaceholder.Item width={142} height={16} marginTop={11} />
							<SkeletonPlaceholder.Item width={89} height={8} marginTop={14} />
						</View>
						<SkeletonPlaceholder.Item flexDirection="row" borderLeftWidth={1} borderBottomWidth={1} borderColor={'#555555'}>
							<SkeletonPlaceholder.Item width={24} height={24} margin={18} />
							<SkeletonPlaceholder.Item flexDirection="row" borderLeftWidth={1} borderColor={'#555555'} />
							<SkeletonPlaceholder.Item width={24} height={24} margin={18} />
						</SkeletonPlaceholder.Item>
					</View>
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
	subContainer: {
		flexDirection: 'row',
		paddingLeft: 16,
		justifyContent: 'space-between',
	},
}));

export default SearchProfilePlaceholder;
