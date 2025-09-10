import { useState, useCallback, useMemo } from 'react';
import { View, Text as RNText } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';
import ProjectItem from './ProjectItem';
import { useNavigation } from '@react-navigation/native';
import IProject from '@models/entities/IProject';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import { useStudioContext } from './StudioContext';
import useGetStudioBookings from '@network/useGetStudioBookings';
import useHandleLogout from '@utils/signout';

interface IProps {
	title: string;
	color: string;
	emptyMessage?: string;
	status: EnumStudioStatus;
}

export default function StudioProjectsItem({ title, color, emptyMessage, status }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const [clicked, setClicked] = useState(false);
	const { studioFloor } = useStudioContext();
	const navigation = useNavigation();
	const message = useMemo(() => emptyMessage || `Looks like you have no ${title?.toLowerCase()} yet.`, [emptyMessage, title]);

	const { data: response } = useGetStudioBookings(studioFloor?.id, status, clicked);
	const data = response?.data;
	const status_code = response?.status;
	const logout = useHandleLogout(false);

	if (status_code == 401) {
		logout();
	}

	const handleProjectPress = useCallback(
		(project: IProject) => {
			navigation.navigate('StudioConversation', {
				id: project?.conversation_id,
				project_name: project.project_name,
				party1Id: studioFloor?.id,
				party2Id: project?.producer_id,
				project_id: project.project_id,
				name: project.project_name,
				receiver_id: project.producer_id,
			});
		},
		[navigation],
	);

	const renderItem = useCallback(({ item, index }: { item: IProject; index: number }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={color} listLength={data?.length} />, [handleProjectPress, color, data?.length]);

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
			<Accordion title={title} onToggle={expanded => setClicked(expanded)}>
				<FlashList data={data} renderItem={renderItem} estimatedItemSize={60} keyExtractor={(item, index) => String(index)} ListEmptyComponent={listEmptyComponent} />
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
}));
