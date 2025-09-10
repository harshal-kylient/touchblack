import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';

import { Text } from '@touchblack/ui';

function Dashboard() {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.container}>
			<Text style={styles.dashboardTextContainer} size="primaryMid" color="regular">
				Dashboard
			</Text>
			<View style={styles.contentContainer}>
				<View style={styles.listContainer}>
					{dashboardData.map((item, index) => {
						return (
							<View key={index} style={styles.itemContainer}>
								<View style={styles.item(index)}>
									<Text size="primaryMid" color="primary">
										{item.amount}
									</Text>
									<Text size="primarySm" color="regular">
										{item.label}
									</Text>
								</View>
							</View>
						);
					})}
				</View>
			</View>
		</View>
	);
}

export default Dashboard;

const stylesheet = createStyleSheet(theme => ({
	container: {
		width: '100%',
		gap: theme.gap.base,
		marginTop: 40,
	},
	contentContainer: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderWidthWidth: theme.borderWidth.slim,
	},
	dashboardTextContainer: { paddingLeft: theme.padding.base },
	listContainer: {},
	itemContainer: {
		alignItems: 'baseline',
		borderBottomColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		paddingHorizontal: theme.padding.base,
	},
	item: (index: number) => ({
		alignSelf: index === 0 ? 'flex-start' : index === 1 ? 'center' : 'flex-end',
		flexDirection: 'row',
		gap: theme.gap.base,
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundLightBlack,
		paddingVertical: theme.padding.xs,
		paddingHorizontal: theme.padding.base,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		marginTop: -1,
	}),
}));

const dashboardData = [
	{
		label: 'Profiles',
		amount: '37,000+',
	},
	{
		label: 'Films',
		amount: 'Over 10,000+',
	},
	{
		label: 'Production Houses',
		amount: '550+',
	},
];
