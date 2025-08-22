import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import RevenueCard from './RevenueCard';

function RevenueOverview() {
	const { styles } = useStyles(stylesheet);
	const data = [
		{
			title: 'Total Revenue (til date)',
			amount: '0',
			projects: 0,
		},
		{
			title: 'Revenue pending',
			amount: '0',
			projects: 0,
		},
	];

	return (
		<View style={styles.container}>
			<View style={styles.revenueContainer}>
				{data.map((item, index) => (
					<RevenueCard key={index} title={item.title} amount={item.amount} projects={item.projects} index={index} />
				))}
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.black,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
	},
	revenueContainer: {
		flexDirection: 'row',
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.base,
		marginHorizontal: theme.margins.base,
	},
}));

export default RevenueOverview;
