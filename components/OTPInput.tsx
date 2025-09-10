import { useRef, useState, useEffect } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IProps {
	value: string[] | number[];
	onChange: (value: string[] | number[]) => void;
	maxlength: number;
}

export default function OTPInput({ value, onChange, maxlength }: IProps) {
	const inputRef = useRef<TextInput>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const { styles } = useStyles(stylesheet);

	const handleChange = (text: string) => {
		const arr = [];
		for (let i = 0; i < maxlength; i++) {
			arr[i] = text[i];
		}
		onChange(arr);
		if (text.length >= maxlength) {
			inputRef.current?.blur();
			return;
		} else {
			setActiveIndex(text.length);
		}
	};

	const handleOnPress = (index: number) => {
		setActiveIndex(index);
		inputRef.current?.focus();
	};

	function OTPBox(digit: number | string, index: number) {
		const isValueFocused = index === activeIndex;
		return (
			<Pressable key={index} onPress={() => handleOnPress(index)} style={[styles.pressable, styles.box, isValueFocused && Keyboard.isVisible() && styles.boxFocused]}>
				<Text style={styles.text}>{digit || ''}</Text>
				{isValueFocused && Keyboard.isVisible() && !value[activeIndex] ? <Blinker /> : null}
			</Pressable>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.flexRow}>{value.map(OTPBox)}</View>
			<TextInput pointerEvents="box-only" ref={inputRef} style={styles.input} onChangeText={handleChange} keyboardType="numeric" maxLength={maxlength} value={value.join('')} />
		</View>
	);
}

import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const Blinker = ({ size = 2, color = 'white', interval = 500 }) => {
	const opacity = useSharedValue(1);

	useEffect(() => {
		opacity.value = withTiming(0, { duration: interval / 2, easing: Easing.linear });
		const intervalId = setInterval(() => {
			opacity.value = withTiming(opacity.value === 1 ? 0 : 1, {
				duration: interval / 2,
				easing: Easing.linear,
			});
		}, interval);
		return () => clearInterval(intervalId);
	}, [opacity, interval]);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	return <Animated.View style={[{ width: size, height: '40%', backgroundColor: color }, animatedStyle]} />;
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 62,
	},
	flexRow: { flexDirection: 'row' },
	pressable: {
		width: '100%',
		flex: 1,
	},
	text: {
		textAlign: 'center',
		color: theme.colors.typography,
		fontSize: theme.fontSize.primaryH2,
	},
	boxFocused: {
		justifyContent: 'center',
		aspectRatio: 1,
		alignItems: 'center',
		borderColor: theme.colors.primary,
		borderWidth: 1,
		flex: 1,
	},
	box: {
		height: 62,
		flexDirection: 'row',
		justifyContent: 'center',
		aspectRatio: 1,
		alignItems: 'center',
		borderColor: theme.colors.borderGray,
		borderWidth: 1,
		flex: 1,
	},
	input: {
		position: 'absolute',
		fontSize: theme.fontSize.primaryH2,
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		opacity: 0,
		color: theme.colors.typography,
		borderColor: theme.colors.borderGray,
		borderWidth: 1,
		padding: 16,
	},
}));
