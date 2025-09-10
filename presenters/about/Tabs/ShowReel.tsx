import { ScrollView, StatusBar, TouchableOpacity, View } from 'react-native';
import { TextInput } from '@touchblack/ui';
import { Filter } from '@touchblack/icons';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { darkTheme } from '@touchblack/ui/theme';
// import { FilmsMockData } from '../../../components/home/films/FilmsMockData';
// import FilmThumbnailItem from '../../../components/home/films/FilmThumbnailItem';

const stylesheet = createStyleSheet(theme => ({
	inputContainer: {
		position: 'relative',
		paddingHorizontal: theme.padding.lg,
		borderTopColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.bold,
	},
	HorizontalScrollableGridContainer: {
		width: UnistylesRuntime.screen.width,
		marginTop: theme.padding.base,
	},
	HorizontalScrollableGrid: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	separatorView: {
		width: 16,
	},
	filterBtn: {
		backgroundColor: theme.colors.backgroundLightBlack,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: theme.borderWidth.slim,
		borderTopColor: theme.colors.borderGray,
		borderRightColor: theme.colors.borderGray,
		borderBottomColor: theme.colors.borderGray,
	},
	inputWrapper: {
		flexDirection: 'row',
		marginTop: 24,
	},
}));

const ShowReel = () => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.inputContainer}>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
			<View style={styles.inputWrapper}>
				<TextInput placeholder="Search" placeholderTextColor={darkTheme.colors.muted} borderWidth="bold" borderColor="borderGray" paddingVertical="xs" />
				<TouchableOpacity style={styles.filterBtn}>
					<Filter color="red" size="24" strokeColor="black" />
				</TouchableOpacity>
			</View>
			{/* <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    paddingHorizontal: 36,
                    pointerEvents: 'none',
                }}>
                <Search color="black" size="32" strokeColor="white" />
            </View> */}
			<View style={styles.HorizontalScrollableGridContainer}>
				<ScrollView showsHorizontalScrollIndicator={false} style={styles.HorizontalScrollableGrid}>
					<View style={styles.separatorView} />
					{/* {FilmsMockData.map((film, index) => {
						return <FilmThumbnailItem key={index} item={film} index={index} />;
					})} */}
					<View style={styles.separatorView} />
				</ScrollView>
			</View>
		</View>
	);
};

export default ShowReel;
