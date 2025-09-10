import { Pressable, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useState } from 'react';

import { FilterList } from '@touchblack/icons';

import StudioTitle from './components/StudioTitle';
import StudioInvoicesOverview from './components/StudioInvoicesOverview';
import StudioInvoicesHistory from './components/StudioInvoicesHistory';
import Upcoming from '@components/errors/Upcoming';

function StudioInvoices() {
	const { styles, theme } = useStyles(stylesheet);
	const [isOpen, setIsOpen] = useState(false);
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={styles.header}>
				<StudioTitle textStyle={styles.title} dropdownStyle={{ top: 53 }} />
				<Pressable onPress={() => setIsOpen(!isOpen)}>
					<FilterList color={theme.colors.typography} size="24" />
				</Pressable>
			</View>
			<ScrollView contentContainerStyle={styles.scrollView}>
				{/* <StudioInvoicesOverview />
				<StudioInvoicesHistory /> */}
				<View style={styles.upcomingContainer}>
					<Upcoming />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	scrollView: {
		flexGrow: 1,
		gap: 0,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	upcomingContainer: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
		marginTop: theme.margins.base * 5,
	},
	header: {
		paddingHorizontal: theme.padding.base,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		zIndex: 9999,
		paddingBottom: theme.padding.sm,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	title: {
		fontSize: 24,
	},
}));

export default StudioInvoices;
