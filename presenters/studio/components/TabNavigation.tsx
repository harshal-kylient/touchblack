import React from 'react';
import { View, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { TABS, TabType } from '../StudioFloorDetails';

interface TabNavigationProps {
	activeTab: TabType;
	setActiveTab: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.tabContainer}>
			{TABS.map(({ id, title }) => (
				<Pressable key={id} onPress={() => setActiveTab(title)} style={styles.tab(activeTab === title)} accessibilityRole="tab" accessibilityState={{ selected: activeTab === title }}>
					<Text size="button" numberOfLines={1} color={activeTab === title ? 'primary' : 'regular'}>
						{title}
					</Text>
					<View style={styles.absoluteContainer(activeTab === title)} />
				</Pressable>
			))}
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tabContainer: {
		paddingHorizontal: theme.padding.xs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundLightBlack,
		marginTop: theme.margins.xxl,
	},
	tab: (active: boolean) => ({
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: active ? theme.colors.black : theme.colors.backgroundLightBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: active ? theme.colors.borderGray : theme.colors.transparent,
		paddingVertical: theme.padding.xs,
		position: 'relative',
	}),
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 1,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
}));
