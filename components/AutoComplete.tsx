import { useRef, useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Tag, Text, TextInput } from '@touchblack/ui';
import { Close, Search } from '@touchblack/icons';

interface IProps {
	items: any[];
	placeholder?: string;
	itemsToShow?: number;
	value: any;
	onChange: (item: any) => void;
	onSearch: (query: string) => void;
	onOpen?: () => void;
	style?: any;
	selectStyle?: any;
}

export default function AutoComplete({ items, placeholder, onSearch, itemsToShow, value, onChange, onOpen, style, selectStyle, ...props }: IProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState('');
	const height = useSharedValue(0);
	const { styles, theme } = useStyles(stylesheet);
	const placeholderText = placeholder || 'Search';
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
		setQuery('');
		setIsOpen(false);
		onChange(item);
	}

	function handleSearch(query: string) {
		setIsOpen(Boolean(query));
		onSearch(query);
		setQuery(query);
	}

	return (
		<View style={[styles.z99, style]} {...props}>
			<View style={styles.flexRow}>
				<Search size="20" style={styles.search} />
				<TextInput style={styles.input} value={query} onChangeText={handleSearch} placeholder={placeholderText} ref={selectRef} />
			</View>
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
						<Text color="muted" size="bodyMid">
							No results found
						</Text>
					)}
				</ScrollView>
			</Animated.View>
			{Boolean(value?.id) && (
				<View style={[styles.actionableTag, styles.bgBlack]}>
					<Text size="bodyMid" style={styles.actionableLabel}>
						{value.name}
					</Text>
					<TouchableOpacity onPress={() => onChange(null)}>
						<Close size="24" color={theme.colors.primary} />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	input: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: theme.colors.black,
		paddingRight: theme.padding.xxs + 2,
		paddingLeft: 42,
	},
	actionableTag: {
		flexDirection: 'row',
		alignItems: 'center',

		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: theme.colors.borderGray,
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		gap: theme.gap.xs,
		backgroundColor: theme.colors.transparent,
		marginTop: theme.margins.sm,
	},
	actionableLabel: {
		color: theme.colors.typography,
		flexShrink: 1,
	},
	bgBlack: { backgroundColor: theme.colors.black },
	flexRow: { flexDirection: 'row' },
	z99: {
		zIndex: 99,
		position: 'relative',
	},
	search: { position: 'absolute', top: 15, left: 12, zIndex: 999 },
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
