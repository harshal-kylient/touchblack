import { memo, useCallback } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Text } from '@touchblack/ui';

import ProjectItem from './ProjectItem';
import Header from '@components/Header';
import IProject from '@models/entities/IProject';
import { IStatus } from '@models/entities/IStatus';
import useGetAllProjectsByDate from '@network/useGetAllProjectsByDate';
import moment from 'moment';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { getProducerProjectPerDayViewBackgroundColor } from '@utils/calendarColors';

interface IProps {
	route: { params: { date: string; day: string; month: string } };
}

const ProducerProjectsPerDayView = memo(({ route }: IProps) => {
	const day = route.params?.day;
	const dateString = day?.dateString;
	const date = day?.day;
	const month: number = day?.month;
	const year: number = day?.year;

	const projects = useGetAllProjectsByDate(`${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}`, dateString);
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	const handleProjectPress = useCallback(
		(project: IProject) => {
			navigation.navigate('ProjectDetails', { project_id: project?.id, project_status: project?.status });
		},
		[navigation],
	);

	// TODO: clean this up
	const status = {};
	const projectsFormattedByStatus = {};
	projects?.forEach(it => {
		status[it?.status] = status[it?.status] ? status[it?.status] + 1 : 1;
		projectsFormattedByStatus[it?.status] = projectsFormattedByStatus[it?.status] ? [...projectsFormattedByStatus[it?.status], it] : [it];
	});

	const liveProjects = projects?.filter(it => it?.status === EnumProducerStatus.Live) || [];
	const completedProjects = projects?.filter(it => it?.status === EnumProducerStatus.Completed) || [];

	return (
		<SafeAreaView style={styles.container}>
			<Header name={dateString} style={styles.header} />
			<ScrollView style={styles.body}>
				<View style={styles.infoContainer}>
					<View style={styles.dateContainer}>
						<Text size="inputLabel" style={styles.dayText}>
							{moment(date).format('dddd')}
						</Text>
						<Text size="primaryBig" style={styles.dateText}>
							{`${String(date).padStart(2, '0')}`}.{`${String(month).padStart(2, '0')}`}
						</Text>
					</View>
					<View style={styles.statusInfoContainer}>
						{Object.entries(status).map(([key, value]) => (
							<View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs }}>
								<View
									style={{
										width: 10,
										height: 10,
										borderRadius: 24,
										backgroundColor: key === EnumProducerStatus.Live ? theme.colors.success : key === EnumProducerStatus.Completed ? theme.colors.verifiedBlue : theme.colors.borderGray,
									}}
								/>
								<Text size="bodyBig" color="regular">
									{value} {key}
								</Text>
							</View>
						))}
						{!Object.keys(status).length && (
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs }}>
								<View style={{ width: 10, height: 10, borderRadius: 24, backgroundColor: theme.colors.borderGray }} />
								<Text size="bodyMid" color="muted">
									No Projects
								</Text>
							</View>
						)}
					</View>
				</View>
				{liveProjects?.length ? (
					<View>
						<Text size="primaryMid" style={styles.projectsText} color="regular">
							Live Projects
						</Text>
						<FlashList data={liveProjects} renderItem={({ item, index }) => <ProjectItem item={item} index={index} showLocation={true} onPress={() => handleProjectPress(item)} color={theme.colors.success} listLength={liveProjects.length} />} estimatedItemSize={60} keyExtractor={(_, index) => String(index)} />
					</View>
				) : null}
				{completedProjects?.length ? (
					<View>
						<Text size="primaryMid" style={styles.projectsText} color="regular">
							Completed Projects
						</Text>
						<FlashList data={completedProjects} renderItem={({ item, index }) => <ProjectItem item={item} index={index} showLocation={true} onPress={() => handleProjectPress(item)} color={theme.colors.verifiedBlue} listLength={completedProjects.length} />} estimatedItemSize={60} keyExtractor={(_, index) => String(index)} />
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
});

export default ProducerProjectsPerDayView;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {},
	body: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	dateContainer: {
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.steps,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dayText: {
		color: theme.colors.typography,
		opacity: 0.6,
	},
	dateText: {
		color: theme.colors.typography,
		fontSize: 40,
	},
	statusInfoContainer: {
		paddingVertical: theme.padding.xxs,
		paddingHorizontal: theme.padding.base,
		gap: theme.gap.steps,
	},
	statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.steps,
	},
	statusText: {
		color: theme.colors.typography,
		opacity: 0.6,
	},
	infoContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		borderBottomWidth: theme.borderWidth.slim,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	dot: (status: IStatus) => ({
		width: 8,
		height: 8,
		borderRadius: 50,
		backgroundColor: getProducerProjectPerDayViewBackgroundColor(status),
	}),
	projectsText: {
		color: theme.colors.typography,
		padding: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
