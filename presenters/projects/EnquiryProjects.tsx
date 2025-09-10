import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';

import { FlashList } from '@shopify/flash-list';
import { Accordion } from '@touchblack/ui';

import ProjectItem from './ProjectItem';
import { useProjects } from './ProjectContext';
import NoWorkFound from '@components/errors/NoWorkFound';
import IProject from '@models/entities/IProject';

const EnquiryProjects = memo(() => {
	const { styles, theme } = useStyles(stylesheet);
	const { filteredEnquiryProjects } = useProjects();
	const navigation = useNavigation();

	const handleEndReached = useCallback(() => {}, []);

	const handleProjectPress = useCallback(
		(project: IProject) => {
			navigation.navigate('ProjectDetails', { project });
		},
		[navigation],
	);

	return (
		<View style={styles.container}>
			<Accordion customStyles={styles.accordionContainer} title="Enquiries">
				<FlashList data={filteredEnquiryProjects} renderItem={({ item, index }) => <ProjectItem item={item} index={index} onPress={() => handleProjectPress(item)} color={theme.colors.primary} listLength={filteredEnquiryProjects.length} />} estimatedItemSize={60} keyExtractor={item => item.id} onEndReached={handleEndReached} onEndReachedThreshold={0.5} ListEmptyComponent={NoWorkFound} />
			</Accordion>
		</View>
	);
});

export default EnquiryProjects;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
	},
	accordionContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
	},
}));
