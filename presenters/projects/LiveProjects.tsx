import { SafeAreaView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';

import ProjectItem from './ProjectItem';
import IProject from '@models/entities/IProject';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import useGetProducerProjects from '@network/useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import NoProjects from '@components/errors/NoProjects';
import CONSTANTS from '@constants/constants';
import Header from '@components/Header';
import FloatingButton from '@components/FloatingButton';
import { useProjectsContext } from './ProjectContext';
import { useAuth } from '@presenters/auth/AuthContext';
import SearchInput from '@components/SearchInput';

interface IProps {}

export default function LiveProjects({ route }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const screen = route?.params?.screen || false;
	const [clicked, setClicked] = useState(true);
	const [query, setQuery] = useState('');
	const { data, isLoading, fetchNextPage, hasNextPage } = useGetProducerProjects(EnumProducerStatus.Live, clicked, query);
	const navigation = useNavigation();
	const { permissions, loginType } = useAuth();
	const allowedToEdit = loginType === 'producer' ? permissions?.includes('Project::Edit') : true;

	const { dispatch } = useProjectsContext();
	const { userId, businessOwnerId } = useAuth();

	const handleProject = () => {
		dispatch({ type: 'RESET' });
		navigation.navigate('CreateProjectStep1');
	};

	const handleEndReached = () => {
		if (!isLoading && hasNextPage) {
			fetchNextPage();
		}
	};

	const handleProjectPress = (project: IProject) => {
		navigation.navigate('ProjectDetails', { project_id: project.id, project_name: project.project_name, video_type_id: project?.video_type?.id });
	};

	if (screen)
		return (
			<SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundDarkBlack }]}>
				<Header name="Live Projects" />
				<SearchInput searchQuery={query} setSearchQuery={setQuery} placeholderText="Search Project" />
				<FlashList
					data={data}
					contentContainerStyle={{ paddingTop: theme.padding.base }}
					renderItem={({ item, index }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={theme.colors.success} listLength={data.length} />}
					estimatedItemSize={60}
					keyExtractor={item => String(item.id)}
					onEndReached={handleEndReached}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoProjects title="No Project" />
						</View>
					}
				/>
				{allowedToEdit && userId === businessOwnerId && <FloatingButton onPress={handleProject} />}
			</SafeAreaView>
		);

	return (
		<View style={styles.container}>
			<Accordion title="Live Projects" onToggle={expanded => setClicked(expanded)}>
				<FlashList
					data={data}
					renderItem={({ item, index }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={theme.colors.success} listLength={data.length} />}
					estimatedItemSize={60}
					keyExtractor={item => String(item.id)}
					onEndReached={handleEndReached}
					ListEmptyComponent={
						<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<NoProjects title="No Project" />
						</View>
					}
				/>
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
