import React from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { ArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

interface StudioCardProps {
	id: number;
	label: string;
	isLast: boolean;
	onPress: (id: number) => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ id, label, isLast, onPress }) => {
	const { styles } = useStyles(stylesheet);

	return (
		<Pressable onPress={() => onPress(id)} style={styles.cardContainer(isLast)} accessibilityRole="button">
			<View style={styles.card}>
				<Text color="regular" weight="regular" size="secondary">
					{label}
				</Text>
				<ArrowRight color="white" size="20" />
			</View>
		</Pressable>
	);
};

const stylesheet = createStyleSheet(theme => ({
	cardContainer: (isLast: boolean) => ({
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: isLast ? theme.borderWidth.slim : 0,
		borderColor: theme.colors.borderGray,
	}),
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		marginHorizontal: theme.margins.base,
	},
}));

export default StudioCard;
