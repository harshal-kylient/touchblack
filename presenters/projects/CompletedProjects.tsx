import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';

import ProjectItem from './ProjectItem';
import { useNavigation } from '@react-navigation/native';
import IProject from '@models/entities/IProject';
import useGetProducerProjects from '@network/useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useState } from 'react';
import CONSTANTS from '@constants/constants';
import NoProjects from '@components/errors/NoProjects';

export default function CompletedProjects() {
	const { styles, theme } = useStyles(stylesheet);
	const [clicked, setClicked] = useState(false);
	const { data, isLoading, fetchNextPage, hasNextPage } = useGetProducerProjects(EnumProducerStatus.Completed, clicked);
	const navigation = useNavigation();

	const handleEndReached = () => {
		if (!isLoading && hasNextPage) {
			fetchNextPage();
		}
	};

	const handleProjectPress = (project: IProject) => {
		navigation.navigate('ProjectDetails', { project_id: project.id, project_name: project.project_name, project_status: 'Completed' });
	};

	return (
		<View style={styles.container}>
			<Accordion onToggle={expanded => setClicked(expanded)} title="Completed Projects">
				<FlashList
					data={data}
					renderItem={({ item, index }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={theme.colors.verifiedBlue} listLength={data.length} />}
					estimatedItemSize={60}
					keyExtractor={item => String(item.id)}
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.5}
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
