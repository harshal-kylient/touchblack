import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

const LargeGridPlaceholder = ({ numberOfItems = 1 }: { numberOfItems?: number }) => {
	const { styles } = useStyles(stylesheet);

	const renderSkeletonItems = (numberOfItems: number) => {
		const items = [];
		const adjustedWidth = UnistylesRuntime.screen.width - 32;

		for (let i = 0; i < numberOfItems; i++) {
			items.push(
				<SkeletonPlaceholder.Item flexDirection="column" marginLeft={i == 0 ? 16 : 0} borderLeftWidth={1} borderColor={'#555555'} height={193} width={adjustedWidth} key={i}>
					<SkeletonPlaceholder.Item width={adjustedWidth} height={119} />
					<View style={styles.subContainer}>
						<View>
							<SkeletonPlaceholder.Item width={86} height={16} marginTop={11} />
							<SkeletonPlaceholder.Item width={48} height={8} marginTop={16} />
						</View>
						<SkeletonPlaceholder.Item width={24} height={24} marginVertical={19} />
					</View>
				</SkeletonPlaceholder.Item>,
			);
		}
		return items;
	};

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder direction="right" highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item flexDirection="row">{renderSkeletonItems(numberOfItems)}</SkeletonPlaceholder.Item>
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
		paddingHorizontal: 16,
		justifyContent: 'space-between',
	},
}));

export default LargeGridPlaceholder;
