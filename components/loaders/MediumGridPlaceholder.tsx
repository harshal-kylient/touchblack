import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const MediumGridPlaceholder: React.FC = () => {
	const { styles } = useStyles(stylesheet);
	const renderSkeletonItems = () => {
		const items = [];
		for (let i = 0; i < 3; i++) {
			items.push(
				<SkeletonPlaceholder.Item flexDirection="column" marginLeft={i == 0 ? 16 : 0} borderLeftWidth={1} borderColor={'#555555'} height={179} width={179} key={i}>
					<SkeletonPlaceholder.Item width={179} height={119} />
					<View style={styles.subContainer}>
						<View>
							<SkeletonPlaceholder.Item width={86} height={16} marginTop={11} />
							<SkeletonPlaceholder.Item width={48} height={8} marginTop={14} />
						</View>
						<SkeletonPlaceholder.Item width={24} height={24} marginVertical={18} />
					</View>
				</SkeletonPlaceholder.Item>,
			);
		}
		return items;
	};

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="row">{renderSkeletonItems()}</SkeletonPlaceholder.Item>
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
		gap: 37,
	},
}));

export default MediumGridPlaceholder;
