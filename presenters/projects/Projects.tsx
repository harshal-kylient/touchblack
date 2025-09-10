import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import LiveProjects from './LiveProjects';
import CompletedProjects from './CompletedProjects';
import { useProjectsContext } from './ProjectContext';
import FloatingButton from '@components/FloatingButton';
import NoProjects from '@components/errors/NoProjects';
import CONSTANTS from '@constants/constants';

import useGetProducerProjects from '@network/useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useAuth } from '@presenters/auth/AuthContext';
import { useCallback } from 'react';
import { useFilterContext } from '@components/drawerNavigator/Filter/FilterContext';
import { useStudioBookingContext } from '@presenters/studio/booking/StudioContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Projects() {
	const { styles, theme } = useStyles(stylesheet);
	/* Itne paise me beta yahi milta hai */
	const { dispatch } = useProjectsContext();
	const { dispatch: dispatchStudio } = useStudioBookingContext();
	const { dispatch: searchDispatch } = useFilterContext();
	const navigation = useNavigation();
	const { userId, businessOwnerId } = useAuth();

	useFocusEffect(
		useCallback(() => {
			searchDispatch({ type: 'QUERY', value: '' });
			searchDispatch({ type: 'RESET_FILTERS' });
			dispatch({ type: 'RESET' });
			dispatchStudio({ type: 'RESET' });
		}, [searchDispatch]),
	);

	const { data: liveProjects } = useGetProducerProjects(EnumProducerStatus.Live);
	const { data: completedProjects } = useGetProducerProjects(EnumProducerStatus.Completed);
	const insets = useSafeAreaInsets();
	const handleProject = () => {
		dispatch({ type: 'RESET' });
		navigation.navigate('CreateProjectStep1');
	};

	return (
		<SafeAreaView style={[styles.container,{ paddingTop: insets.top * 0.60 }]}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View>
				<View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.base }}>
					<Text style={{ fontFamily: theme.fontFamily.cgMedium, fontSize: theme.fontSize.primaryH2, color: theme.colors.typography }}>Projects</Text>
				</View>
				{/*<SearchInput placeholderText="Search Projects..." searchQuery={query} setSearchQuery={setQuery} />*/}
			</View>
			<ScrollView style={styles.scrollView}>
				{liveProjects?.length ? <LiveProjects /> : null}
				{completedProjects?.length ? <CompletedProjects /> : null}
				{!liveProjects?.length && !completedProjects?.length ? (
					<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
						<NoProjects />
					</View>
				) : null}
			</ScrollView>
			{userId === businessOwnerId && <FloatingButton onPress={handleProject} />}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	scrollView: {},
	floatingButton: (projectView: 'calendar' | 'list') => ({
		bottom: projectView === 'calendar' ? '6%' : '2%',
	}),
}));
