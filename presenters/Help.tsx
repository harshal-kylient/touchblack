import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function Help() {
	const { styles } = useStyles(stylesheet);
	const data = [
		{ id: 1, label: 'Call Us' },
		{ id: 2, label: 'Mail Us' },
	];

	return (
		<SafeAreaView style={styles.container}>
			{data.map((item, index) => (
				<View key={item.id} style={styles.itemContainer(index, data)}>
					<View style={styles.itemBorder}>
						<TouchableOpacity style={styles.item}>
							<Text style={styles.itemText}>{item.label}</Text>
							<Text style={styles.itemText}>&gt;</Text>
						</TouchableOpacity>
					</View>
				</View>
			))}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: theme.padding.xs,
	},
	itemContainer: (index: number, data: any) => ({
		borderTopWidth: 1,
		borderColor: theme.colors.borderGray,
		marginTop: index === 0 ? 24 : 0,
		borderBottomWidth: index === data.length - 1 ? 1 : 0,
	}),
	itemBorder: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: 1,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: 1,
		borderRightColor: theme.colors.borderGray,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	itemText: {
		color: 'white',
		fontWeight: '400',
		fontSize: theme.fontSize.secondary,
	},
}));
