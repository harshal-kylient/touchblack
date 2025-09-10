import { useRef, useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { ArrowDown } from '@touchblack/icons';

interface IProps {
	items: any[];
	placeholder?: string;
	itemsToShow?: number;
	value: any;
	disabled?: boolean;
	onChange: (item: any) => void;
	onOpen?: () => void;
	style?: any;
	selectStyle?: any;
}

export default function Select({ items, disabled, placeholder, itemsToShow, value, onChange, onOpen, style, selectStyle, ...props }: IProps) {
	const [isOpen, setIsOpen] = useState(false);
	const height = useSharedValue(0);
	const { styles, theme } = useStyles(stylesheet);
	const placeholderText = placeholder || 'Select an item';
	const itemsToShowUp = itemsToShow || items?.length;
	const selectRef = useRef(null);

	const animatedStyle = useAnimatedStyle(() => ({
		height: withTiming(isOpen ? height.value : 0, {
			duration: 300,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		}),
	}));

	useEffect(() => {
		if (isOpen && selectRef.current) {
			//@ts-ignore
			selectRef.current.measure((x, y, width, measuredHeight) => {
				height.value = Math.min(itemsToShowUp, items.length) * measuredHeight;
			});
		}
	}, [isOpen, height, items, itemsToShowUp]);

	function handleSelect(item: any) {
		setIsOpen(false);
		onChange(item);
	}

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		if (onOpen) {
			onOpen();
		}
	};

	return (
		<View style={[styles.z99, style]} {...props}>
			<Pressable style={styles.container} ref={selectRef} onPress={disabled ? () => {} : toggleDropdown}>
				<Text color={!disabled && value?.name ? 'regular' : 'muted'} size="bodyMid">
					{value?.name || placeholderText}
				</Text>
				<ArrowDown size="16" color={value?.name ? theme.colors.typography : theme.colors.muted} />
			</Pressable>

			<Animated.View style={[styles.dropdownItems, animatedStyle, selectStyle]}>
				<ScrollView nestedScrollEnabled>
					{items?.length > 0 ? (
						items?.map((item, index) => (
							<TouchableOpacity style={styles.button} key={index} onPress={() => handleSelect(item)}>
								<Text size="bodyMid" color="regular" style={styles.dropdownItem}>
									{item.name}
								</Text>
							</TouchableOpacity>
						))
					) : (
						<Text color="muted" textAlign="center" style={styles.pBase} size="bodyBig">
							No results found
						</Text>
					)}
				</ScrollView>
			</Animated.View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		paddingHorizontal: theme.padding.xxs + 2,
		paddingVertical: theme.padding.base,
	},
	pBase: { padding: theme.padding.base },
	z99: { zIndex: 99, position: 'relative' },
	dropdownItems: {
		backgroundColor: theme.colors.backgroundLightBlack,
		overflow: 'hidden',
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dropdownItem: {
		paddingHorizontal: theme.padding.xxs + 2,
		paddingVertical: theme.padding.base,
	},
}));
