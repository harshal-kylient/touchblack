import { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Pressable, FlatList, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { ArrowDown } from '@touchblack/icons';

interface data {
	id: number;
	name: string;
}
interface ListSelectProps {
	items: data[];
	placeholder?: string;
	itemsToShow?: number;
	value: string;
	disabled?: boolean;
	onChange: (item: string) => void;
	onOpen?: () => void;
	style?: ViewStyle;
	selectStyle?: ViewStyle;
}

export default function ListSelectDropdown({ items, disabled, placeholder, itemsToShow, value, onChange, onOpen, style, selectStyle, ...props }: ListSelectProps) {
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

	const handleSelect = (item: data) => {
		setIsOpen(false);
		onChange(item);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
		if (onOpen) {
			onOpen();
		}
	};

	return (
		<View style={[styles.container, style]} {...props}>
			<Pressable style={styles.primaryContainer} ref={selectRef} onPress={disabled ? () => {} : toggleDropdown}>
				<Text color={!disabled && value?.name ? 'regular' : 'muted'} size="bodyMid">
					{value?.name || placeholderText}
				</Text>
				<View style={styles.arrowContainer}>
					<ArrowDown size="22" color={theme.colors.backgroundDarkBlack} style={isOpen && { transform: [{ rotate: '180deg' }] }} />
				</View>
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
						<Text color="muted" textAlign="center" style={styles.emptyContainer} size="bodyBig">
							No results found
						</Text>
					}
				/>
			</Animated.View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	primaryContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
		paddingHorizontal: theme.padding.xxs + 2,
	},
	emptyContainer: {
		padding: theme.padding.base,
	},
	container: {
		zIndex: 99,
		position: 'relative',
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
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
	},
	arrowContainer: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.base,
		marginRight: -theme.padding.xs,
		backgroundColor: theme.colors.primary,
	},
}));
