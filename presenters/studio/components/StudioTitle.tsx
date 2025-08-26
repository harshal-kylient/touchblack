import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { ArrowDown, ArrowUp } from '@touchblack/icons';

import { StudioFloor, useStudioContext } from '../StudioContext';
import capitalized from '@utils/capitalized';

interface StudioTitleProps {
	textStyle?: any;
	dropdownStyle?: any;
}

const StudioTitle: React.FC<StudioTitleProps> = ({ textStyle, dropdownStyle }) => {
	const { styles } = useStyles(stylesheet);
	const { studioFloor, setStudioFloor, studioFloors, isStudioTitleOpen, setIsStudioTitleOpen } = useStudioContext();

	const animatedStyle = useAnimatedStyle(() => ({
		height: withTiming(isStudioTitleOpen ? studioFloors.length * 60 : 0, { duration: 300 }),
		opacity: withTiming(isStudioTitleOpen ? 1 : 0, { duration: 300 }),
	}));

	const handleSelect = (item: StudioFloor) => {
		setIsStudioTitleOpen(false);
		setStudioFloor(item);
	};

	const toggleDropdown = () => {
		setIsStudioTitleOpen(!isStudioTitleOpen);
	};

	if (studioFloor === null) {
		return null;
	}

	return (
		<View style={{ zIndex: 9999 }}>
			<Pressable onPress={toggleDropdown} style={styles.container}>
				<Text size="primaryBig" color="regular" style={[styles.titleText, textStyle]} numberOfLines={1}>
					{capitalized(studioFloor?.name || '')}
				</Text>
				{isStudioTitleOpen ? <ArrowUp size="24" /> : <ArrowDown size="24" />}
			</Pressable>
			<Animated.ScrollView style={[styles.dropdownItems, animatedStyle, dropdownStyle]}>
				{studioFloors.map(floor => (
					<Pressable style={styles.button} key={floor.id} onPress={() => handleSelect(floor)}>
						<Text size="bodyMid" color="regular" numberOfLines={1} style={styles.dropdownItem}>
							{capitalized(floor.name)}
						</Text>
					</Pressable>
				))}
			</Animated.ScrollView>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xs,
		position: 'relative',
	},
	titleText: {
		maxWidth: '88%',
		lineHeight: 36,
	},
	dropdownItems: {
		backgroundColor: theme.colors.backgroundLightBlack,
		overflow: 'hidden',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		maxWidth: 234,
		position: 'absolute',
		top: 50,
		left: 0,
		zIndex: 999999,
	},
	button: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		// paddingVertical:theme.padding.base
	},
	dropdownItem: {
		paddingHorizontal: theme.padding.xxs + 2,
		paddingVertical: theme.padding.xl + 2,
	},
}));

export default StudioTitle;
