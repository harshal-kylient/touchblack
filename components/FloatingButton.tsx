import React, { useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

interface FloatingButtonProps {
	onPress: () => void;
	style?: ViewStyle;
	textStyle?: ViewStyle;
	label?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress, style, textStyle, label }) => {
	const { styles } = useStyles(stylesheet);
	const [isPressed, setIsPressed] = useState(false);
	return (
		<Pressable style={[styles.button, style, { opacity: isPressed ? 0.5 : 1 }]} onPress={onPress} onPressIn={() => setIsPressed(true)} onPressOut={() => setIsPressed(false)}>
			<View style={styles.textContainer}>
				<Text size="primaryBig" color="black" style={[styles.text, textStyle]}>
					{label || '+'}
				</Text>
			</View>
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	button: {
		position: 'absolute',
		width: 45,
		height: 45,
		borderRadius: 30,
		backgroundColor: theme.colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
		bottom: '3%', // 62 is the bottom navigator height, 45 is the button height, 16 is the bottom padding
		right: theme.padding.base,
	},
	textContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 40,
	},
}));

export default FloatingButton;
