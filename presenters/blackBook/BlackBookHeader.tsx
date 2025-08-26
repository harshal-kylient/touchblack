import Header from '@components/Header';
import SearchInput from '@components/SearchInput';
import { IBlackBookTabs } from '@models/entities/IBlackBookTabs';
import { Text } from '@touchblack/ui';
import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IBlackBookHeaderProps {
	handleActiveBlackBookTab: (tab: IBlackBookTabs) => void;
	activeTab: IBlackBookTabs;
	tabs: IBlackBookTabs[];
	searchQuery?: any;
	setSearchQuery?: any;
}

function BlackBookHeader({ handleActiveBlackBookTab, activeTab, tabs, searchQuery, setSearchQuery }: IBlackBookHeaderProps) {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.headerContainer}>
			<View style={{ flexDirection: 'row', backgroundColor: theme.colors.backgroundDarkBlack, justifyContent: 'space-between', paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base }}>
				<Text style={{ fontFamily: theme.fontFamily.cgMedium, fontSize: theme.fontSize.primaryH2, color: theme.colors.typography }}>Blackbook</Text>
			</View>
			<View style={styles.searchAndFilterContainer}>
				<SearchInput searchIconOffset={false} searchQuery={searchQuery} setSearchQuery={setSearchQuery} containerStyles={styles.searchInputContainer} placeholderText="Search Talent..." />
			</View>
			<View style={styles.tabsContainer}>
				{tabs.map((tab, index) => (
					<TouchableOpacity onPress={() => handleActiveBlackBookTab(tab)} style={styles.tabContainer(activeTab.id === tab.id)} key={index}>
						<Text size="button" numberOfLines={1} color={activeTab.id === tab.id ? 'primary' : 'regular'}>
							{tab.label}
						</Text>
						{activeTab.id === tab.id && <View style={styles.bottomBorderAbsoluteElement} />}
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}

export default BlackBookHeader;

const stylesheet = createStyleSheet(theme => ({
	blackBookScreenContainer: {
		width: '100%',
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	headerContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderBottomWidth: theme.borderWidth.slim,
		borderBottomColor: theme.colors.borderGray,
	},
	searchAndFilterContainer: {
		flexDirection: 'row',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		marginHorizontal: theme.margins.base,
	},
	searchInputContainer: {
		marginHorizontal: 0,
		flex: 1,
		marginVertical: 0,
		paddingHorizontal: 0,
	},
	filterButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundLightBlack,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		width: 48,
	},
	tabsContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		justifyContent: 'space-between',
		marginTop: theme.margins.xxl,
		paddingHorizontal: theme.padding.base,
	},
	bottomBorderAbsoluteElement: {
		position: 'absolute',
		bottom: -1,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: theme.colors.black,
	},
	tabContainer: (isActive: boolean) => ({
		paddingVertical: theme.padding.xs,
		flex: isActive ? 3 : 2,
		backgroundColor: isActive ? theme.colors.black : theme.colors.transparent,
		borderTopWidth: isActive ? theme.borderWidth.slim : 0,
		borderTopColor: theme.colors.borderGray,
		borderLeftWidth: isActive ? theme.borderWidth.slim : 0,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: isActive ? theme.borderWidth.slim : 0,
		borderRightColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	}),
}));
