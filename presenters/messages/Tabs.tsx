import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import { useMessageContext } from './MessagesContext';

function MessagesTabs() {
	const { styles } = useStyles(stylesheet);
	const { state, dispatch } = useMessageContext();
	const tabs = ['All', '1st', '2nd', '3rd'];

	const handleTabPress = (index: number) => {
		dispatch({ type: 'TAB_CHANGE', value: index });
	};

	return (
		<View style={styles.tabsContainer}>
			{tabs.map((tab, index) => {
				const isSelected = index === state.activeTab;

				return (
					<Pressable onPress={() => handleTabPress(index)} style={styles.tabContainer(isSelected)} key={index}>
						<Text size="button" numberOfLines={1} color={isSelected ? 'primary' : 'regular'}>
							{tab}
						</Text>
						{isSelected && <View style={styles.bottomBorderAbsoluteElement} />}
					</Pressable>
				);
			})}
		</View>
	);
}

export default MessagesTabs;

const stylesheet = createStyleSheet(theme => ({
	tabsContainer: {
		flexDirection: 'row',
		marginTop: theme.margins.xxl,
		paddingHorizontal: theme.padding.base,
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	bottomBorderAbsoluteElement: {
		position: 'absolute',
		bottom: -1,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: theme.colors.black,
	},
	tabContainer: (isActive: boolean) => ({
		paddingVertical: theme.padding.xs,
		flex: 1,
		backgroundColor: isActive ? theme.colors.black : theme.colors.transparent,
		borderTopWidth: isActive ? theme.borderWidth.slim : 0,
		borderTopColor: theme.colors.borderGray,
		borderLeftWidth: isActive ? theme.borderWidth.slim : 0,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: isActive ? theme.borderWidth.slim : 0,
		borderRightColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	}),
}));
