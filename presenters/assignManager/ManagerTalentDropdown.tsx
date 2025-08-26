import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { ArrowDown, ArrowUp } from '@touchblack/icons';
import capitalized from '@utils/capitalized';
import { useTalentContext } from './ManagerTalentContext';

interface TalentDropdownProps {
	charecterLength?: number | undefined;
}

const ManagerTalentDropdown: React.FC<TalentDropdownProps> = ({ charecterLength }) => {
	const { styles } = useStyles(stylesheet);
	const { selectedTalent, setSelectedTalent, setSelectedTalentId, talentList, isTalentDropdownOpen, setIsTalentDropdownOpen, setObject } = useTalentContext();
	const animatedStyle = useAnimatedStyle(() => ({
		height: withTiming(isTalentDropdownOpen ? talentList.length * 60 : 0, { duration: 300 }),
		opacity: withTiming(isTalentDropdownOpen ? 1 : 0, { duration: 300 }),
	}));

	const handleSelect = talent => {
		setSelectedTalent(talent);
		setObject('selected-talent', talent);
		setIsTalentDropdownOpen(false);
		setSelectedTalentId(talent.id);
	};

	const toggleDropdown = () => {
		setIsTalentDropdownOpen(!isTalentDropdownOpen);
	};

	const selectedName = selectedTalent?.talent?.first_name && selectedTalent?.talent?.last_name ? capitalized(`${selectedTalent.talent.first_name} ${selectedTalent.talent.last_name}`) : 'No Talents found';

	return (
		<View style={styles.mainDropdown}>
			<Pressable onPress={toggleDropdown} style={styles.container}>
				<Text size="primaryMid" color="regular" style={styles.titleText} numberOfLines={1}>
					{selectedName?.length > charecterLength ? `${selectedName.slice(0, charecterLength)}..` : selectedName}
				</Text>
				{isTalentDropdownOpen ? <ArrowUp size="24" color="#E9BF99" /> : <ArrowDown size="24" color="#E9BF99" />}
			</Pressable>
			<Animated.ScrollView style={[styles.dropdownItems, animatedStyle]}>
				{talentList?.map(talent => (
					<Pressable style={styles.button} key={talent.id} onPress={() => handleSelect(talent)}>
						<Text size="bodyMid" color="regular" numberOfLines={1} style={styles.dropdownItem}>
							{capitalized(talent?.talent?.first_name + ' ' + talent?.talent?.last_name)}
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
		gap: theme.gap.xxs,
		position: 'relative',
	},
	mainDropdown: { zIndex: 99999 },
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
		paddingRight: theme.padding.base * 5,
	},
	dropdownItem: {
		paddingHorizontal: theme.padding.xxs + 2,
		paddingVertical: theme.padding.xl + 2,
		width: '100%',
	},
}));

export default ManagerTalentDropdown;
