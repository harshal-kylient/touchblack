import { useState, useCallback, useMemo, useEffect } from 'react';
import EnumStatus from '@models/enums/EnumStatus';
import useGetTalentProjects from '@network/useGetTalentProjects';
import { RefreshControl, View, Text as RNText, ActivityIndicator, SafeAreaView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';
import ProjectItem from './ProjectItem';
import { useNavigation } from '@react-navigation/native';
import IProject from '@models/entities/IProject';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import CONSTANTS from '@constants/constants';
import { useSubscription } from '@presenters/subscriptions/subscriptionRestrictionContext';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import { boolean } from 'zod';

interface IProps {
	title: string;
	color: string;
	emptyMessage?: string;
	status: EnumStatus;
	isOpen: boolean;
}

export default function TalentProjectsItem({ title, color, emptyMessage, status, isOpen }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [clicked, setClicked] = useState(isOpen);
	const navigation = useNavigation();
	const { data: managerStatus } = useGetManagerStatus();
	const managerId = managerStatus?.data?.manager_talent;
	const { subscriptionData } = useSubscription();
	const message = useMemo(() => emptyMessage || `Looks like you have no ${title?.toLowerCase()} yet.`, [emptyMessage, title]);
	const { data, isLoading, isFetching, refetch, hasNextPage, fetchNextPage } = useGetTalentProjects(status, clicked);

	useEffect(() => {
		setClicked(isOpen);
	}, [isOpen]);
	const handleEndReached = useCallback(() => {
		if (!isLoading && hasNextPage) {
			fetchNextPage();
		}
	}, [isLoading, hasNextPage, fetchNextPage]);
	const handleProjectPopUp = (item: IProject) => {
		const restriction = subscriptionData[CONSTANTS.POPUP_TYPES.PROJECT];
		if (restriction?.data?.popup_configuration) {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.SubscriptionRestrictionPopup,
					data: restriction.data.popup_configuration,
				},
			});
		} else {
			handleProjectPress(item);
		}
	};

	const handleProjectPress = useCallback(
		(project: IProject) => {
			if (managerId) return;
			navigation.navigate('ProjectConversation', {
				id: project?.conversation_id,
				project_name: project.project_name,
				project_id: project.id,
				project_invitation_id: project.project_invitation_id,
				name: project.project_name,
				receiver_id: project.producer_id,
				owner_name: project.producer_name,
				picture: project.producer_profile_picture_url,
				owner_profile_picture: createAbsoluteImageUri(project.producer_profile_picture_url),
			});
		},
		[navigation],
	);

	const renderItem = useCallback(({ item, index }: { item: IProject; index: number }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPopUp(item)} color={color} listLength={data?.length} />, [handleProjectPress, color, data?.length]);

	const listEmptyComponent = useMemo(
		() => (
			<View style={{ paddingHorizontal: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, backgroundColor: theme.colors.backgroundLightBlack, paddingVertical: 16 }}>
				<RNText style={{ fontStyle: 'italic', color: theme.colors.muted }}>{message}</RNText>
			</View>
		),
		[theme.padding.base, theme.borderWidth.slim, theme.colors.borderGray, theme.colors.backgroundLightBlack, theme.colors.muted, message],
	);
	return (
		<View style={styles.container}>
			<Accordion title={title} isExpanded={clicked} onToggle={expanded => setClicked(expanded)}>
				<FlashList data={data} renderItem={renderItem} estimatedItemSize={60} keyExtractor={item => String(item.id)} onEndReached={handleEndReached} refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />} ListEmptyComponent={listEmptyComponent} />
			</Accordion>
		</View>
	);
}

const stylesheet = createStyleSheet(() => ({
	container: {
		flex: 1,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	loaderContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
}));
