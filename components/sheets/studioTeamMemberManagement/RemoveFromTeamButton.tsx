import { Delete } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const RemoveFromTeamButton = ({ onPress }: { onPress: () => void }) => {
	const { styles, theme } = useStyles(stylesheet);
	return (
		<View style={[styles.subContainer(0, 1)]}>
			<Pressable onPress={onPress} style={styles.cardContainer}>
				<View style={styles.card}>
					<Text color="regular" weight="regular" size="primarySm">
						Remove from team
					</Text>
				</View>
				<View style={styles.checkboxContainer}>
					<Delete size="24" color={theme.colors.typography} />
				</View>
			</Pressable>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	subContainer: (index, totalLength) => ({
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: index === totalLength - 1 ? theme.borderWidth.bold : theme.borderWidth.none,
	}),
	cardContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		borderRightColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	checkboxContainer: {
		flexDirection: 'row',
		gap: 40,
		marginRight: theme.margins.sm,
	},
}));
