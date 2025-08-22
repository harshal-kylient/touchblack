import { View } from 'react-native';
import { Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { formatAmount } from '@utils/formatCurrency';

function RevenueCard({ title, amount, projects, index }: { title: string; amount: string; projects: number; index: number }) {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container(index)}>
			<Text size="bodyMid" color="regular">
				{title}
			</Text>
			<View style={styles.revenueContainer}>
				<Text size="primaryMid" weight="bold" color="regular">
					{formatAmount(amount)}
				</Text>
				<Text size="bodyMid" color="muted">
					for{' '}
					<Text size="bodyMid" color="regular" weight="bold">
						{projects}
					</Text>{' '}
					Projects
				</Text>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: (index: number) => ({
		paddingHorizontal: theme.padding.xs,
		paddingVertical: theme.padding.base,
		gap: theme.gap.base,
		flex: 1,
		borderColor: theme.colors.borderGray,
		borderRightWidth: index === 0 ? theme.borderWidth.slim : 0,
	}),
	revenueContainer: {
		gap: theme.gap.xxs,
	},
}));

export default RevenueCard;
