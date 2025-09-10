import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface TabsPlaceholderProps {
	numberOfTabs?: number;
	activeTabIndex?: number;
}

const TabsPlaceholder: React.FC<TabsPlaceholderProps> = ({ numberOfTabs = 3, activeTabIndex = 0 }) => {
	const { styles } = useStyles(stylesheet);
	const tabCount = useMemo(() => Math.max(2, numberOfTabs), [numberOfTabs]); // Ensure at least 2 tabs
	const screenWidth = Dimensions.get('window').width;
	const tabWidth = useMemo(() => (screenWidth - 32) / tabCount, [screenWidth, tabCount]); // 32 is the total horizontal margin

	return (
		<View style={styles.container}>
			<SkeletonPlaceholder highlightColor="#000" backgroundColor="#393939">
				<SkeletonPlaceholder.Item marginTop={24} marginHorizontal={16}>
					<View style={styles.subContainer}>
						{[...Array(tabCount)].map((_, index) => (
							<View key={index} style={[styles.tabWrapper, { width: tabWidth }, index === 0 && styles.firstTab, index === tabCount - 1 && styles.lastTab, index === activeTabIndex && styles.activeTab]}>
								<SkeletonPlaceholder.Item
									width={tabWidth - 32} // Subtract horizontal padding
									height={16}
									marginHorizontal={16}
									marginVertical={12}
								/>
							</View>
						))}
					</View>
				</SkeletonPlaceholder.Item>
			</SkeletonPlaceholder>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	subContainer: {
		flexDirection: 'row',
	},
	tabWrapper: {
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	firstTab: {
		borderLeftWidth: theme.borderWidth.bold,
	},
	lastTab: {
		borderRightWidth: theme.borderWidth.bold,
	},
	activeTab: {
		borderBottomWidth: theme.borderWidth.bold,
		borderBottomColor: theme.colors.primary, // Assuming there's a primary color in your theme
	},
}));

export default TabsPlaceholder;
