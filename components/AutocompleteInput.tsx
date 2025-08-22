import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TextInput, Pressable, TouchableWithoutFeedback, ActivityIndicator, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { ArrowDown } from '@touchblack/icons';
import { FlashList } from '@shopify/flash-list';

interface AutocompleteInputProps {
	items: Array<{ id: string; name: string }>;
	placeholder?: string;
	value: { id: string; name: string } | null;
	onChange: (item: { id: string; name: string } | null) => void;
	onSearch?: (query: string) => void;
	onLoadMore?: () => void;
	style?: any;
	inputStyle?: any;
	isLoading?: boolean;
	itemsToShow?: number;
	errors?: any;
	name?: string;
}

const AutocompleteInput = React.forwardRef<TextInput, AutocompleteInputProps>(({ items, placeholder, itemsToShow, value, onChange, onSearch, onLoadMore, style, inputStyle, isLoading = false, errors, name, ...props }, ref) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [query, setQuery] = useState<string>('');
	const height = useSharedValue(0);
	const { styles, theme } = useStyles(stylesheet);
	const placeholderText = placeholder || 'Search...';
	const listRef = useRef<FlashList<any>>(null);
	const [itemHeight, setItemHeight] = useState(0);
	const NUM_ITEMS_TO_SHOW = itemsToShow || 4;

	const animatedStyle = useAnimatedStyle(() => ({
		height: withTiming(isOpen ? height.value : 0, {
			duration: 300,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		}),
		opacity: withTiming(isOpen ? 1 : 0, {
			duration: 300,
			easing: Easing.bezier(0.25, 0.1, 0.25, 1),
		}),
	}));

	useEffect(() => {
		if (value?.name) {
			setQuery(value.name);
		}
	}, [value]);

	useEffect(() => {
		if (isOpen && listRef.current) {
			listRef.current.scrollToOffset({ offset: 0, animated: false });
		}
	}, [isOpen, items]);

	useEffect(() => {
		if (itemHeight > 0) {
			height.value = Math.min(items.length, NUM_ITEMS_TO_SHOW) * itemHeight;
		}
	}, [itemHeight, items.length, height, NUM_ITEMS_TO_SHOW]);

	const handleSelect = useCallback(
		(item: { id: string; name: string }) => {
			setIsOpen(false);
			onChange(item);
			setQuery(item.name);
		},
		[onChange],
	);

	const handleInputChange = useCallback(
		(text: string) => {
			setQuery(text);
			setIsOpen(true);
			if (onSearch) {
				onSearch(text);
			}
		},
		[onSearch],
	);

	const renderItem = useCallback(
		({ item }: { item: { id: string; name: string } }) => (
			<Pressable
				style={styles.button}
				onPress={() => handleSelect(item)}
				onLayout={(event: LayoutChangeEvent) => {
					const { height } = event.nativeEvent.layout;
					if (height > 0 && height !== itemHeight) {
						setItemHeight(height);
					}
				}}>
				<Text size="bodyMid" color="regular" style={styles.dropdownItem}>
					{item.name}
				</Text>
			</Pressable>
		),
		[handleSelect, styles, itemHeight],
	);

	return (
		<TouchableWithoutFeedback onPress={() => setIsOpen(true)}>
			<View style={[{ zIndex: 99, position: 'relative' }, style]} {...props}>
				<View
					style={[
						styles.container,
						{
							borderColor: name && errors[name] ? theme.colors.destructive : theme.colors.borderGray,
						},
					]}>
					<TextInput ref={ref} style={[styles.textInput, inputStyle]} placeholder={placeholderText} placeholderTextColor={theme.colors.typographyLight} value={query} onChangeText={handleInputChange} onFocus={() => setIsOpen(true)} />
					<Pressable onPress={() => setIsOpen(!isOpen)}>
						<ArrowDown size="16" color={value?.id ? theme.colors.typography : theme.colors.muted} />
					</Pressable>
				</View>
				<Animated.View style={[styles.dropdownItems, animatedStyle]}>{isOpen && <FlashList nestedScrollEnabled ref={listRef} data={items} renderItem={renderItem} estimatedItemSize={itemHeight || 50} onEndReached={onLoadMore} onEndReachedThreshold={0.5} ListFooterComponent={isLoading ? <ActivityIndicator size="small" color={theme.colors.typography} /> : null} />}</Animated.View>
			</View>
		</TouchableWithoutFeedback>
	);
});

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: 10,
		backgroundColor: theme.colors.black,
	},
	textInput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Regular',
		paddingVertical: theme.padding.base,
		flex: 1,
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
		paddingVertical: theme.padding.xl + 2,
	},
	textinput: {
		borderWidth: theme.borderWidth.slim,
		color: theme.colors.typography,
		backgroundColor: theme.colors.black,
		fontFamily: 'CabinetGrotesk-Regular',
	},
	inputPadding: {
		flexGrow: 1,
		paddingHorizontal: 10,
	},
}));

export default AutocompleteInput;
