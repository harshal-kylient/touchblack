import EnumStatus from '@models/enums/EnumStatus';
import useGetTalentProjects from '@network/useGetTalentProjects';
import { RefreshControl, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';

import ProjectItem from './ProjectItem';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import IProject from '@models/entities/IProject';
import NoProjects from '@components/errors/NoProjects';
import CONSTANTS from '@constants/constants';

export default function EnquireProjects() {
	const { styles, theme } = useStyles(stylesheet);
	const [clicked, setClicked] = useState(false);
	const navigation = useNavigation();

	const { data, isLoading, isFetching, refetch, hasNextPage, fetchNextPage } = useGetTalentProjects(EnumStatus.Enquiry, clicked);

	const handleEndReached = () => {
		if (!isLoading && hasNextPage) {
			fetchNextPage();
		}
	};

	const handleProjectPress = (project: IProject) => {
		navigation.navigate('ProjectDetails', { project_id: project.id, project_name: project.project_name });
	};

	return (
		<View style={styles.container}>
			<Accordion title="Enquiries" onToggle={expanded => setClicked(expanded)}>
				<FlashList
					data={data}
					renderItem={({ item, index }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={theme.colors.primary} listLength={data.length} />}
					estimatedItemSize={60}
					keyExtractor={item => String(item.id)}
					onEndReached={handleEndReached}
					refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
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
