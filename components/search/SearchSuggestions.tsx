import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { GridView, Text } from '@touchblack/ui';
const data = {};

function SearchSuggestions({ setIsSearching, setSearchQuery }: { setIsSearching: (bool: boolean) => any; setSearchQuery: (query: string) => void }) {
	const { styles, theme } = useStyles(stylesheet);

	const renderTabs = ({ item }: any) => {
		return (
			<TouchableOpacity
				onPress={() => {
					setSearchQuery(item.tag);
					setIsSearching(true);
				}}
				style={styles.card(item.id)}>
				<Text size="primarySm" color="regular" weight="regular">
					{item.icon}
				</Text>
				<Text color="regular" weight="regular" size="primarySm" style={styles.textTag}>
					{item.tag}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Text size="secondary" color="regular" weight="regular" style={styles.text}>
				Suggestions
			</Text>
			<View style={styles.subContainer}>
				<View style={styles.gridContainer}>
					<GridView
						data={data}
						renderItem={renderTabs}
						numColumns={2}
						columnWrapperStyle={{
							backgroundColor: theme.colors.backgroundDarkBlack,
						}}
					/>
				</View>
			</View>
		</>
	);
}

export default SearchSuggestions;

const stylesheet = createStyleSheet(theme => ({
	card: (id: number) => ({
		borderRightWidth: id % 2 === 0 ? theme.borderWidth.none : theme.borderWidth.slim,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingLeft: 10,
		flex: 1,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		backgroundColor: theme.colors.black,
	}),
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: 10,
	},
	backgroundColorContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.xxl,
		flex: 1,
	},
	textTag: {
		paddingLeft: theme.padding.xxs,
	},
	subContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	gridContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
	},
	text: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		paddingVertical: theme.padding.base,
	},
	inputContainer: {
		marginTop: theme.margins.base,
	},
	tabBg: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 0,
		flex: 1,
		width: '100%',
	},
	button: {
		flexGrow: 1,
		marginHorizontal: theme.margins.base,
		marginBottom: theme.margins.xxl,
	},
}));
