import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

interface TabProps {
	id: number;
	title: string;
	isActive: boolean;
	onPress: () => void;
}

const Tab: React.FC<TabProps> = ({ id, title, isActive, onPress }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<Pressable key={id} onPress={onPress} style={styles.tab(isActive)} accessibilityRole="tab" accessibilityState={{ selected: isActive }}>
			<Text size="button" numberOfLines={1} color={isActive ? 'primary' : 'regular'}>
				{title}
			</Text>
			<View style={styles.absoluteContainer(isActive)} />
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	tab: (active: boolean) => ({
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: active ? theme.colors.black : theme.colors.backgroundDarkBlack,
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

export default Tab;
