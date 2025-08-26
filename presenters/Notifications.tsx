import { ActivityIndicator, RefreshControl, SafeAreaView, StatusBar, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { darkTheme } from '@touchblack/ui/theme';
import { FlashList } from '@shopify/flash-list';
import { Button, Text } from '@touchblack/ui';

import NotificationItem from '@components/NotificationItem';
import Header from '@components/Header';
import useGetAllNotifications from '@network/useGetAllNotifications';
import INotificationItem from '@models/entities/INotificationItem';
import NoNotifications from '@components/errors/NoNotifications';
import CONSTANTS from '@constants/constants';
import { useNavigation } from '@react-navigation/native';

const tabs = ['All', 'Unread', 'Read'];

function Notifcations() {
	const { styles, theme } = useStyles(stylesheet);
	const [activeTab, setActiveTab] = useState(0);
	const { data: response, isLoading, isFetchingNextPage, hasNextPage, isFetching, fetchNextPage, refetch: mutate } = useGetAllNotifications();
	const data = response?.pages?.flatMap(page => page?.data) || [];
	const filteredData = filterDataByTab(data);
	const unread = data?.filter(item => !item.clicked_at);
	const read = data?.filter(item => item.clicked_at);
	const navigation = useNavigation();

	// TODO: get this filter applied from backend
	function filterDataByTab(data: INotificationItem[]) {
		switch (activeTab) {
			case 0:
				return data;
			case 1:
				return data?.filter(item => !item.clicked_at);
			case 2:
				return data?.filter(item => item.clicked_at);
			default:
				return data;
		}
	}

	const handleActiveNotificationTab = (index: number) => {
		setActiveTab(index);
	};

	const onProjectCompletedPress = () => {
		navigation.navigate('RaiseClaim');
	};

	const projectName = 'Cion - 02';
	const projectText = `Voila! Your agreed amount on the project ${projectName} is ready to be claimed.`;

	const handleShowProjectCompletedSheet = () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Success,
				data: {
					header: 'Project Completed',
					text: projectText,
					onPress: onProjectCompletedPress,
					onPressText: 'Raise a Claim',
				},
			},
		});
	};

	if (isLoading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack, justifyContent: 'center', alignItems: 'center' }}>
				<Text size="bodyBig" color="primary">
					Loading...
				</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
			<View style={styles.notificationScreenHeader}>
				<Header name="Notifications" />
				<FlashList
					ListHeaderComponentStyle={{ marginBottom: theme.margins.base }}
					contentContainerStyle={{ backgroundColor: theme.colors.black }}
					ListHeaderComponent={
						<View style={styles.tabsContainer}>
							{tabs.map((tab, index) => (
								<TouchableOpacity onPress={() => handleActiveNotificationTab(index)} style={styles.tabContainer(index === activeTab)} key={index}>
									<Text size="button" color={index === activeTab ? 'primary' : 'regular'}>
										{tab} ({index === 0 ? data.length : index === 1 ? unread.length : read.length})
									</Text>
									{index === activeTab && <View style={styles.bottomBorderAbsoluteElement} />}
								</TouchableOpacity>
							))}
						</View>
					}
					data={filteredData}
					renderItem={({ item }) => <NotificationItem item={item} />}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={mutate} />}
					keyExtractor={item => item?.id || ''}
					onEndReached={() => {
						if (!isLoading && hasNextPage) {
							fetchNextPage();
						}
					}}
					estimatedItemSize={100}
					onEndReachedThreshold={0.5}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (7 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoNotifications />
						</View>
					}
					ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
				/>
			</View>
		</SafeAreaView>
	);
}

export default Notifcations;

const stylesheet = createStyleSheet(theme => ({
	notificationScreenHeader: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	tabsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		paddingHorizontal: theme.padding.base,
		borderBottomColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	tabContainer: (isActive: boolean) => ({
		paddingVertical: theme.padding.xs,
		backgroundColor: isActive ? theme.colors.black : theme.colors.transparent,
		borderTopWidth: isActive ? theme.borderWidth.slim : 0,
		borderTopColor: theme.colors.borderGray,
		borderLeftWidth: isActive ? theme.borderWidth.slim : 0,
		borderLeftColor: theme.colors.borderGray,
		borderRightWidth: isActive ? theme.borderWidth.slim : 0,
		borderRightColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	}),
	bottomBorderAbsoluteElement: {
		position: 'absolute',
		bottom: -1,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: theme.colors.black,
	},
	notificationsContainer: {
		paddingTop: theme.margins.xxl,
		backgroundColor: theme.colors.black,
	},
	notificationsScrollContentContainer: {
		paddingBottom: 54,
	},
}));
