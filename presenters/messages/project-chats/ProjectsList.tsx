import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import SearchInput from '@components/SearchInput';
import capitalized from '@utils/capitalized';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';
import NoProjects from '@components/errors/NoProjects';
import useGetAllProjects from '@network/useGetAllProjects';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';

export default function ProjectsList() {
	const { styles } = useStyles(stylesheet);
	const [query, setQuery] = useState<string>('');
	const [ queryOne, setQueryOne] = useState<string>('');
	const { loginType } = useAuth();
	const { data, isLoading, hasNextPage, fetchNextPage, isFetching, refetch } = useGetAllProjects(query);

	const handleEndReached = useCallback(() => {
		if (!isLoading && hasNextPage) {
			fetchNextPage();
		}
	}, [isLoading, hasNextPage, fetchNextPage]);

	const handleRefresh = useCallback(() => {
		refetch();
	}, [refetch]);

	const filteredData = useMemo(() => {
		if (loginType === 'talent' || loginType === 'manager') {
			if (queryOne?.trim()) {
				const q = queryOne.toLowerCase();
				return data?.filter(item => item.project_name?.toLowerCase().includes(q) || item.producer_name?.toLowerCase().includes(q));
			}
		}
		return data;
	}, [data, queryOne, loginType]);


	const ListEmptyComponent = useMemo(
		() => (
			<View style={styles.emptyContainer}>
				<NoProjects title="No Project Chats" />
			</View>
		),
		[styles.emptyContainer],
	);

	const renderItem = useCallback(({ item, index }) => <ProjectListItem item={item} index={index} />, []);

	return (
		<>
			{(loginType === 'talent' || loginType === 'manager') && (
				<View style={{overflow:'hidden'}}>
					<SearchInput searchQuery={queryOne} setSearchQuery={setQueryOne} placeholderText="Search Projects..." />
					<Text size="bodySm" color="muted" style={styles.messageOne}>
						* Can search the project chats based on the project name or producer name
					</Text>
				</View>
			)}
			{loginType === 'producer' && <SearchInput searchQuery={query} setSearchQuery={setQuery} placeholderText="Search Projects..." />}
			<FlashList data={filteredData} renderItem={renderItem} estimatedItemSize={60} keyExtractor={item => String(item.id)} onEndReached={handleEndReached} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={handleRefresh} />} ListEmptyComponent={ListEmptyComponent} />
		</>
	);
}

function ProjectListItem({ item, index }) {
	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation();
	const { loginType } = useAuth();
	const { subscriptionData } = useSubscription();

	const handleItemPress = useCallback(() => {
		if (loginType === 'producer') {
			navigation.navigate('ProjectTalentsList', { project_id: item.id, project_name: capitalized(item.project_name) });
		} else {
			const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.MAILBOX_PROJECTS_CHATS];
			if (restriction?.data?.popup_configuration) {
				SheetManager.show('Drawer', {
					payload: {
						sheet: SheetType.SubscriptionRestrictionPopup,
						data: restriction.data.popup_configuration,
					},
				});
			} else {
				navigation.navigate('ProjectConversation', {
					id: item?.conversation_id,
					project_id: item.id,
					project_invitation_id: item.project_invitation_id,
					name: item.project_name,
					receiver_id: item.producer_id,
					owner_name: item.producer_name,
					picture: item.producer_profile_picture_url,
					owner_profile_picture: createAbsoluteImageUri(item.producer_profile_picture_url),
				});
			}
		}
	}, [item, loginType, navigation]);

	return (
		<Pressable onPress={handleItemPress} style={styles.container(false, index)}>
			<View style={styles.messageInfo}>
				<Text size="cardHeading" color="regular" weight="bold" style={styles.username}>
					{capitalized(item.project_name)}
				</Text>
				<View style={styles.infoRow}>
					{item.video_type && (
						<Text size="bodySm" color="muted" style={styles.message} numberOfLines={1}>
							{item.video_type.name}
						</Text>
					)}
					{item.video_type?.name && item.location?.length ? <View style={styles.separator} /> : null}
					<Text size="bodySm" color="muted" style={styles.message} numberOfLines={1}>
						{item.location?.map(it => it.name).join(', ')}
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: (unread: boolean, index: number) => ({
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: unread ? theme.colors.backgroundLightBlack : theme.colors.black,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		height: 64,
	}),
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	separator: {
		height: 10,
		marginHorizontal: theme.padding.xxs,
		width: 1,
		backgroundColor: theme.colors.muted,
	},
	messageInfo: {
		flex: 1,
		gap: theme.gap.steps,
		marginLeft: theme.margins.base,
		paddingVertical: theme.padding.xs,
	},
	username: {
		opacity: 0.8,
	},
	messageOne: {paddingHorizontal:theme.padding.base},
	message:{},
	emptyContainer: {
		flex: 1,
		height: (5.5 * CONSTANTS.screenHeight) / 10,
		justifyContent: 'center',
	},
}));
