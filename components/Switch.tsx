import React, { useRef, useEffect } from 'react';
import { Pressable, Animated } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface SwitchProps {
	value: boolean;
	onToggle: (newValue: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ value, onToggle }) => {
	const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;
	const { styles } = useStyles(stylesheet);
	useEffect(() => {
		Animated.timing(translateX, {
			toValue: value ? 20 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [value]);

	return (
		<Pressable style={[styles.switchContainer(value)]} onPress={() => onToggle(!value)}>
			<Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	switchContainer: value => ({
		width: 42,
		height: 20,
		borderRadius: 20,
		justifyContent: 'center',
		borderColor: value ? theme.colors.primary : theme.colors.typography,
		borderWidth: theme.borderWidth.bold,
		backgroundColor: theme.colors.backgroundDarkBlack,
	}),
	thumb: {
		width: 16,
		height: 16,
		borderRadius: 10,
		marginLeft: 2,
		backgroundColor: theme.colors.primary,
	},
}));

export default Switch;
