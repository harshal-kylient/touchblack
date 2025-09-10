import { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, FlatList } from 'react-native';
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
	onEndReached?: () => void;
}

export default function ListSelect({ items, onEndReached, disabled, placeholder, itemsToShow, value, onChange, onOpen, style, selectStyle, ...props }: IProps) {
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
		<View style={[{ zIndex: 99, position: 'relative' }, style]} {...props}>
			<Pressable style={styles.container} ref={selectRef} onPress={disabled ? () => {} : toggleDropdown}>
				<Text color={!disabled && value?.name ? 'regular' : 'muted'} size="bodyMid">
					{value?.name || placeholderText}
				</Text>
				<ArrowDown size="16" color={value?.name ? theme.colors.typography : theme.colors.muted} />
			</Pressable>

			<Animated.View style={[styles.dropdownItems, animatedStyle, selectStyle]}>
				<FlatList
					data={items || []}
					nestedScrollEnabled
					renderItem={({ item, index }) => (
						<TouchableOpacity style={styles.button} key={index} onPress={() => handleSelect(item)}>
							<Text size="bodyMid" color="regular" style={styles.dropdownItem}>
								{item.name}
							</Text>
						</TouchableOpacity>
					)}
					ListEmptyComponent={
						<Text color="muted" textAlign="center" style={{ padding: theme.padding.base }} size="bodyBig">
							No results found
						</Text>
					}
					onEndReached={onEndReached}
				/>
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
