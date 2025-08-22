import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';

import HeaderPlaceholder from '@components/loaders/HeaderPlaceholder';
import ProfilePlaceholder from '@components/loaders/ProfilePlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';

import SearchInput from '@components/SearchInput';
import UserNotFound from '@components/errors/UserNotFound';

import { useStudioProfileLogic } from './useStudioProfileLogic';
import Header from './Header';
import ProfileCard from './ProfileCard';
import Footer from './Footer';
import Tab from './Tab';
import StudioCard from './floor/StudioCard';
import TeamMember from './team/TeamMember';
import { useRoute } from '@react-navigation/native';
import { TabType } from '../StudioFloorDetails';
import NoStudios from '@components/errors/NoStudios';
import { useAuth } from '@presenters/auth/AuthContext';

const StudioProfile: React.FC = () => {
	const { styles, theme } = useStyles(stylesheet);
	const { params } = useRoute();
	const { userId } = useAuth();
	const activeTabFromParams = params?.activeTabFromParams as TabType | undefined;
	const { TABS, activeTab, searchQuery, setSearchQuery, handleTabSwitch, handleStudioCardPress, handleFooterButtonPress, filteredTeamMembers, isLoading, handleTeamMemberPress, studioFloors, studioFloorsLoading } = useStudioProfileLogic(activeTabFromParams);

	const memoizedTabs = useMemo(() => TABS.map(tab => <Tab key={tab.id} id={tab.id} title={tab.title} isActive={activeTab === tab.title} onPress={() => handleTabSwitch(tab.title)} />), [handleTabSwitch, activeTab]);

	const isUserPartOfStudioTeam = filteredTeamMembers.some(member => member.id === userId);

	if (isLoading || studioFloorsLoading)
		return (
			<SafeAreaView style={styles.container}>
				<HeaderPlaceholder />
				<ProfilePlaceholder />
				<TabsPlaceholder numberOfTabs={2} />
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
			</SafeAreaView>
		);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header />
			<ScrollView contentContainerStyle={styles.scrollViewContent}>
				<ProfileCard />
				<View style={styles.tabsAndStudiosContainer}>
					<View style={styles.tabContainer}>{memoizedTabs}</View>
					{activeTab === 'Studio' && (
						<View style={styles.studiosContainer}>
							<FlashList data={studioFloors} renderItem={({ item, index }) => <StudioCard key={item.id} id={item.id} label={item.name} isLast={index === studioFloors.length - 1} onPress={() => handleStudioCardPress(item.id.toString())} />} ListEmptyComponent={<NoStudios />} estimatedItemSize={60} contentContainerStyle={{ paddingBottom: 1 }} />
						</View>
					)}
					{activeTab === 'Team' && (
						<View style={styles.teamContainer}>
							<SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholderText="Select team member..." />
							<FlashList
								data={filteredTeamMembers}
								renderItem={({ item, index }) => <TeamMember id={item.id} firstName={item.first_name} lastName={item.last_name} role={item.role} studio={item.studio} profilePictureUrl={item.profile_picture_url} onPress={() => !isUserPartOfStudioTeam && handleTeamMemberPress(item.id, item.first_name, item.last_name, item.profile_picture_url)} isLast={index === filteredTeamMembers.length - 1} />}
								keyExtractor={item => item.id.toString()}
								estimatedItemSize={100}
								ListEmptyComponent={<UserNotFound />}
							/>
						</View>
					)}
				</View>
			</ScrollView>
			<Footer onPress={handleFooterButtonPress} activeTab={activeTab} />
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	scrollViewContent: {
		flexGrow: 1,
		gap: theme.gap.xxl,
	},
	tabsAndStudiosContainer: {
		flex: 1,
		backgroundColor: theme.colors.black,
		gap: theme.gap.xxl,
	},
	tabContainer: {
		paddingHorizontal: theme.padding.xs,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	studiosContainer: {
		backgroundColor: theme.colors.black,
	},
	teamContainer: {
		backgroundColor: theme.colors.black,
	},
}));

export default StudioProfile;
