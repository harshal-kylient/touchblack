import { View, Platform, Text, Pressable, StatusBar, SafeAreaView } from 'react-native';

import { darkTheme } from '@touchblack/ui/theme';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useCallback, useMemo, useState } from 'react';
import { Text as UIText } from '@touchblack/ui';
import ProjectsList from '../project-chats/ProjectsList';
import ConversationsList from './ConversationsList';
import { useAuth } from '@presenters/auth/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import CONSTANTS from '@constants/constants';
import NoMessages from '@components/errors/NoMessages';
import EventChats from '../event-chats/EventChats';


export default function AllConversations() {
	const { loginType, permissions } = useAuth();
	const defaultActiveTab = loginType === 'producer' && permissions?.includes('Messages::View') && permissions?.includes('Project::View') ? 0 : loginType === 'producer' && permissions?.includes('Project::View') ? 0 : loginType === 'talent' ? 0 : 1;
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	const { styles, theme } = useStyles(stylesheet);
	const { dispatch: searchDispatch } = useFilterContext();
	const { data: managerStatus } = useGetManagerStatus();
	let isProducer = loginType === 'producer';
	const managerId = managerStatus?.data?.manager_talent;
	const bothActive = loginType === 'producer' ? permissions?.includes('Messages::View') && permissions?.includes('Project::View') : true;
	function handleTabSwitch(tabIndex: number) {
		setActiveTab(tabIndex);
	}
	useFocusEffect(
		useCallback(() => {
			searchDispatch({ type: 'QUERY', value: '' });
			searchDispatch({ type: 'RESET_FILTERS' });
		}, [searchDispatch]),
	);
	const ListEmptyComponent = useMemo(
		() => (
			<View style={styles.emptyContainer}>
				<NoMessages title="Manager in Charge" desc="Project Chats, Now Handled by Your Manager" />
			</View>
		),
		[styles.emptyContainer],
	);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack, paddingTop: Platform.OS === "android" ? theme.padding.base:0 }}>
			<View style={{ flex: 1, backgroundColor: darkTheme.colors.black }}>
				<View style={{ flexDirection: 'row', backgroundColor: theme.colors.backgroundDarkBlack, justifyContent: 'space-between', paddingHorizontal: darkTheme.padding.base, paddingBottom: darkTheme.padding.base }}>
					<Text style={{ fontFamily: darkTheme.fontFamily.cgMedium, fontSize: darkTheme.fontSize.primaryH2, color: darkTheme.colors.typography }}>Mailbox</Text>
				</View>
				{bothActive ? (
					<View style={{ backgroundColor: theme.colors.backgroundDarkBlack, paddingHorizontal: theme.padding.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Pressable onPress={() => handleTabSwitch(0)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.backgroundDarkBlack, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
							<UIText size="primarySm" numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
								Project Chats
							</UIText>
							<View style={styles.absoluteContainer(activeTab === 0)} />
						</Pressable>
						<Pressable onPress={() => handleTabSwitch(1)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.backgroundDarkBlack, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
							<UIText size="primarySm" numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
								Other Chats
							</UIText>
							<View style={styles.absoluteContainer(activeTab === 1)} />
						</Pressable>
						{loginType === 'talent' && (
							<Pressable onPress={() => handleTabSwitch(2)} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 2 ? theme.colors.black : theme.colors.backgroundDarkBlack, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 2 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
								<UIText size="primarySm" numberOfLines={1} color={activeTab === 2 ? 'primary' : 'regular'}>
									Event Chats
								</UIText>
								<View style={styles.absoluteContainer(activeTab === 2)} />
							</Pressable>
						)}
					</View>
				) : null}
				{activeTab === 1 ? <ConversationsList /> : activeTab === 2 ? <EventChats /> : !isProducer && managerId ? ListEmptyComponent : <ProjectsList />}
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	emptyContainer: {
		flex: 1,
		height: (5.5 * CONSTANTS.screenHeight) / 10,
		justifyContent: 'center',
	},
}));
