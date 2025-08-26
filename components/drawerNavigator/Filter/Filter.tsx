import { Platform, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FilterFooter from './FilterFooter';
import FilterBody from './FilterBody';
import Header from '@components/Header';
import { useState } from 'react';

const stylesheet = createStyleSheet(theme => ({
	filterScreenContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
		paddingBottom: 80,
	},
}));

function Filter() {
	const { styles, theme } = useStyles(stylesheet);
	const [applied, setApplied] = useState(false);

	return (
		<View style={styles.filterScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header name="Filters" />
			<FilterBody />
			<FilterFooter applied={applied} setApplied={setApplied} />
		</View>
	);
}

export default Filter;
