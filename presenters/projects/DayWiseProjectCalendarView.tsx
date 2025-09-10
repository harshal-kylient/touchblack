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
import EnumStatus from '@models/enums/EnumStatus';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import { useAuth } from '@presenters/auth/AuthContext';
import { getProjectDayWiseCalendarBackgroundColor } from '@utils/calendarColors';

interface DayWiseProjectCalendarViewProps {
	route: { params: { date: string; day: string; month: string } };
}

const DayWiseProjectCalendarView = memo(({ route }: DayWiseProjectCalendarViewProps) => {
	const day = route.params?.day;
	const dateString = day?.dateString;
	const date = day?.day;
	const month: number = day?.month;
	const year: number = day?.year;

	const projects = useGetAllProjectsByDate(`${String(year).padStart(2, '0')}-${String(month).padStart(2, '0')}`, dateString);
	const { styles, theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const navigation = useNavigation();

	const handleProjectPress = useCallback(
		(project: IProject) => {
			navigation.navigate('ProjectDetails', { project_id: project?.id });
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
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.xxs }}>
								<View style={{ width: 10, height: 10, borderRadius: 24, backgroundColor: key === EnumProducerStatus.Live ? theme.colors.success : key === EnumProducerStatus.Completed || key === EnumStatus.Enquiry ? theme.colors.primary : theme.colors.borderGray }}></View>
								<Text size="bodyBig" color="regular">
									{value} {key}
								</Text>
							</View>
						))}
					</View>
				</View>
				{loginType === 'producer' ? (
					<>
						<Text size="primaryMid" style={styles.projectsText} color="regular">
							Projects
						</Text>
						<FlashList
							data={projects}
							renderItem={({ item, index }) => (
								<ProjectItem item={item} index={index} showLocation={true} onPress={() => handleProjectPress(item)} color={item.status === EnumProducerStatus.Completed ? theme.colors.primary : item.status === EnumStatus.Enquiry ? theme.colors.primary : item.status === EnumStatus.Confirmed ? theme.colors.success : item.status === EnumProducerStatus.Live ? theme.colors.success : item.status === EnumStatus.Not_available ? '#50483b' : 'transparent'} listLength={projects.length} />
							)}
							estimatedItemSize={60}
							keyExtractor={item => item.id}
						/>
					</>
				) : (
					Object.entries(projectsFormattedByStatus)?.map(([key, value]) => (
						<>
							<Text size="primaryMid" style={styles.projectsText} color="regular">
								{key}
							</Text>
							<FlashList
								data={value}
								renderItem={({ item, index }) => (
									<ProjectItem
										item={item}
										index={index}
										showLocation={true}
										onPress={() => handleProjectPress(item)}
										color={item.status === EnumProducerStatus.Completed ? theme.colors.primary : item.status === EnumStatus.Enquiry ? theme.colors.primary : item.status === EnumStatus.Confirmed ? theme.colors.success : item.status === EnumProducerStatus.Live ? theme.colors.success : item.status === EnumStatus.Not_available ? '#50483b' : 'transparent'}
										listLength={projects.length}
									/>
								)}
								estimatedItemSize={60}
								keyExtractor={item => item.id || ''}
							/>
						</>
					))
				)}
			</ScrollView>
		</SafeAreaView>
	);
});

export default DayWiseProjectCalendarView;

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
		backgroundColor: getProjectDayWiseCalendarBackgroundColor(status),
	}),
	projectsText: {
		color: theme.colors.typography,
		padding: theme.padding.base,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
