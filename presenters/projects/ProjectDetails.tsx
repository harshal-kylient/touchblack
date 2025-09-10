import { useCallback, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Pressable, SafeAreaView, ScrollView, Text as RNText, View } from 'react-native';

import { Text } from '@touchblack/ui';

import Header from '@components/Header';
import EnumStatus from '@models/enums/EnumStatus';
import useGetProjectProfessions from '@network/useGetProjectProfessions';
import ProjectInvitationByProfession from './ProjectInvitationByProfession';
import ProjectDetailsView from './ProjectDetailsView';
import CONSTANTS from '@constants/constants';
import UserNotFound from '@components/errors/UserNotFound';
import { useProjectsContext } from './ProjectContext';
import useGetProjectDetails from '@network/useGetProjectDetails';
import ProjectDetailsLoader from './ProjectDetailsLoader';
import server from '@utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import Success from './create-project/Success';
import { useAuth } from '@presenters/auth/AuthContext';
import { useStudioBookingContext } from '@presenters/studio/booking/StudioContext';
import ProjectStudiosList from './ProjectStudiosList';
import capitalized from '@utils/capitalized';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { Hide } from '@touchblack/icons';
import { formatDates } from '@utils/formatDates';
import Modal from '@components/Modal';
import moment from 'moment';

interface IProps {
	projectId: string;
}

export default function ProjectDetails({ route }: IProps) {
	const navigation = useNavigation();
	const projectId = route?.params?.project_id;
	const tab: number = route?.params?.tab || 0;
	const project_name = route?.params?.project_name;
	const project_status = route?.params?.project_status;
	const { loginType, permissions } = useAuth();

	const { styles, theme } = useStyles(stylesheet);
	const [activeTab, setActiveTab] = useState<number>(tab);
	const [message, setMessage] = useState('');
	const [activeStatus, setActiveStatus] = useState<number>(0);
	const [selectedDates, setSelectedDates] = useState<string[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [calendarViewParams, setCalendarViewParams] = useState<{ profession: { id: UniqueId; name: string }; dates: string[]; from_time: string; to_time: string }>({});
	const [created, setCreated] = useState(false);

	const { dispatch: dispatchStudio } = useStudioBookingContext();
	const queryClient = useQueryClient();

	const status = [undefined, EnumStatus.Confirmed, EnumStatus.Enquiry, EnumStatus.Opted_out, EnumStatus.Tentative, EnumStatus.Not_available];

	const { state, dispatch } = useProjectsContext();
	const { data: project_details, isLoading: isLoadingProjectDetails } = useGetProjectDetails(projectId);

	const { data: response2, isLoading: isLoadingProjectProfessions, refetch } = useGetProjectProfessions(projectId, status[activeStatus!]);
	const professions = response2?.data;

	function handleTabSwitch(tabIndex: number) {
		setActiveTab(tabIndex);
	}

	useFocusEffect(
		useCallback(() => {
			dispatch({ type: 'RESET' });
			dispatchStudio({ type: 'RESET' });
		}, []),
	);

	function handleStudioBooking() {
		dispatchStudio({ type: 'PROJECT_ID', value: { id: projectId, name: project_name, video_type: project_details?.video_type } });
		navigation.navigate('StudioBookingStep1');
	}

	async function handleAddMoreTalent() {
		/* Itne paise me beta yahi milta hai */
		dispatch({ type: 'PROJECT_ID', value: projectId });
		dispatch({ type: 'PROJECT_NAME', value: project_name });
		dispatch({ type: 'VIDEO_TYPE', value: project_details?.video_type });
		dispatchStudio({ type: 'PROJECT_ID', value: { id: projectId, name: project_name, video_type: project_details?.video_type } });
		navigation.navigate('CreateProjectStep2');
	}

	async function handleAddTalent() {
		for (let it of professions) {
			if (it?.id === state?.add_to_project?.profession_id) {
				const response = await server.get(CONSTANTS.endpoints.project_invitation_dates(projectId, it?.id));
				const dates = response.data?.data;

				const response2 = await server.post(CONSTANTS.endpoints.project_invitations, {
					project_invitations: [
						{
							dates: dates,
							profession_id: it?.id,
							project_id: projectId,
							talent_ids: [state?.add_to_project?.talent_id],
						},
					],
				});

				if (!response2.data?.success) {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: {
								icon: ({ size }) => <Hide size={size} color={theme.colors.destructive} />,
								header: 'Oops!',
								text: response2.data?.message,
							},
						},
					});
					dispatch({ type: 'CLEAR_ADD_TO_PROJECT' });
				} else {
					SheetManager.show('Drawer', {
						payload: {
							sheet: SheetType.Success,
							data: {
								header: 'Invitations Sent Successfully',
								text: response2.data?.message,
							},
						},
					});
					dispatch({ type: 'CLEAR_ADD_TO_PROJECT' });
					// setMessage(response2.data?.message);
				}

				queryClient.invalidateQueries(['useGetProjectInvitations', projectId, it?.id, EnumStatus.Enquiry]);
				setCreated(false);
			} else {
				// otherwise take calendar date input and then make the call
				setModalVisible(true);
			}
		}
	}

	async function handleEditProject() {
		dispatch({ type: 'CURRENT_STEP', value: 1 });
		dispatch({
			type: 'PROJECT_DETAILS',
			value: {
				brand_id: null,
				project_id: project_details.id,
				film_brief: '',
				film_brief_attachment: null,
				location_ids: [],
				project_name: '',
				video_type_id: null,
			},
		});

		navigation.navigate('CreateProjectStep1');
	}

	async function handleSetDate(value: string[]) {
		setSelectedDates(value);
		const response2 = await server.post(CONSTANTS.endpoints.project_invitations, {
			project_invitations: [
				{
					dates: value,
					profession_id: state?.add_to_project?.profession_id,
					project_id: projectId,
					talent_ids: [state?.add_to_project?.talent_id],
				},
			],
		});

		if (!response2.data?.success) {
			setMessage(response2.data?.message);
			setModalVisible(false);
			return;
		}

		refetch();
		setModalVisible(false);
		setCreated(true);
	}

	function handleCalendarDismiss() {
		setModalVisible(false);
	}

	if (isLoadingProjectDetails || isLoadingProjectProfessions) {
		return <ProjectDetailsLoader />;
	}

	function handleSuccess() {
		queryClient.invalidateQueries(['useGetProjectInvitations', projectId, state?.add_to_project?.profession_id, EnumStatus.Enquiry]);
		dispatch({ type: 'CLEAR_ADD_TO_PROJECT' });
		setCreated(false);
	}

	const addable = state?.add_to_project?.talent_id && project_status !== 'Completed';

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name={capitalized(project_details?.project_name)}>
				{loginType === 'producer' && project_status !== 'Completed' && permissions?.includes('Project::Edit') && (
					<Pressable style={{ paddingVertical: theme.padding.xxs, paddingHorizontal: theme.padding.xs, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.muted }} onPress={handleStudioBooking}>
						<Text size="button" color="primary">
							Book a studio
						</Text>
					</Pressable>
				)}
			</Header>
			<View style={{ flex: 1, backgroundColor: theme.colors.black }}>
				<View style={{ gap: theme.gap.xxl, marginBottom: theme.margins.base, backgroundColor: theme.colors.black, maxHeight: CONSTANTS.screenHeight * 0.9 }}>
					{
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.gap.base, maxHeight: 46, backgroundColor: theme.colors.backgroundDarkBlack, paddingHorizontal: theme.padding.xs, flex: 1, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							<Pressable
								onPress={() => handleTabSwitch(0)}
								style={{ paddingHorizontal: theme.padding.base, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 0 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 0 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
								<Text size="button" numberOfLines={1} color={activeTab === 0 ? 'primary' : 'regular'}>
									Project Details
								</Text>
								<View style={styles.absoluteContainer(activeTab === 0)} />
							</Pressable>
							<Pressable
								onPress={() => handleTabSwitch(1)}
								style={{ paddingHorizontal: theme.padding.base, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 1 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 1 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
								<Text size="button" numberOfLines={1} color={activeTab === 1 ? 'primary' : 'regular'}>
									Talents
								</Text>
								<View style={styles.absoluteContainer(activeTab === 1)} />
							</Pressable>
							<Pressable
								onPress={() => handleTabSwitch(2)}
								style={{ paddingHorizontal: theme.padding.base, justifyContent: 'center', alignItems: 'center', backgroundColor: activeTab === 2 ? theme.colors.black : theme.colors.transparent, borderTopWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderLeftWidth: theme.borderWidth.slim, borderColor: activeTab === 2 ? theme.colors.borderGray : theme.colors.transparent, paddingVertical: theme.padding.xs, position: 'relative' }}>
								<Text size="button" numberOfLines={1} color={activeTab === 2 ? 'primary' : 'regular'}>
									Studio
								</Text>
								<View style={styles.absoluteContainer(activeTab === 2)} />
							</Pressable>
						</ScrollView>
					}
				</View>
				{activeTab === 1 ? (
					<>
						<ScrollView contentContainerStyle={{ borderBottomWidth: professions?.length ? theme.borderWidth.bold : 0, borderColor: theme.colors.borderGray }}>
							<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.padding.sm, paddingHorizontal: theme.padding.base }}>
								<Pressable onPress={() => setActiveStatus(0)} style={{ paddingBottom: 4, paddingHorizontal: 16, borderBottomWidth: activeStatus === 0 ? 2 * theme.borderWidth.bold : 0, borderColor: theme.colors.typography }}>
									<Text color={activeStatus === 0 ? 'regular' : 'muted'} size="bodyBig">
										All
									</Text>
								</Pressable>
								<Pressable onPress={() => setActiveStatus(1)} style={{ paddingBottom: 4, paddingHorizontal: 16, borderBottomWidth: activeStatus === 1 ? 2 * theme.borderWidth.bold : 0, borderColor: theme.colors.typography }}>
									<Text color={activeStatus === 1 ? 'regular' : 'muted'} size="bodyBig">
										Confirmed
									</Text>
								</Pressable>
								<Pressable onPress={() => setActiveStatus(4)} style={{ paddingBottom: 4, paddingHorizontal: 16, borderBottomWidth: activeStatus === 4 ? 2 * theme.borderWidth.bold : 0, borderColor: theme.colors.typography }}>
									<Text color={activeStatus === 4 ? 'regular' : 'muted'} size="bodyBig">
										Tentative
									</Text>
								</Pressable>
								<Pressable onPress={() => setActiveStatus(2)} style={{ paddingBottom: 4, paddingHorizontal: 16, borderBottomWidth: activeStatus === 2 ? 2 * theme.borderWidth.bold : 0, borderColor: theme.colors.typography }}>
									<Text color={activeStatus === 2 ? 'regular' : 'muted'} size="bodyBig">
										Enquiry
									</Text>
								</Pressable>
								<Pressable onPress={() => setActiveStatus(3)} style={{ paddingBottom: 4, paddingHorizontal: 16, borderBottomWidth: activeStatus === 3 ? 2 * theme.borderWidth.bold : 0, borderColor: theme.colors.typography }}>
									<Text color={activeStatus === 3 ? 'regular' : 'muted'} size="bodyBig">
										Opted Out
									</Text>
								</Pressable>
							</ScrollView>
							{professions?.length ? (
								professions?.map((it, index) => <ProjectInvitationByProfession onCalendarPress={setCalendarViewParams} index={index} projectId={projectId} profession={it} key={it.id} status={status[activeStatus]} />)
							) : (
								<View style={{ flex: 1, height: (6 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
									<UserNotFound title={`No Talent ${status[activeStatus] || 'Found'} !`} desc={`No talent has their status set to ${status[activeStatus] || 'any'}`} />
								</View>
							)}
						</ScrollView>
					</>
				) : activeTab === 2 ? (
					<ProjectStudiosList project_id={projectId} />
				) : (
					<ProjectDetailsView id={projectId} />
				)}
			</View>
			{/*modalVisible ? <CalendarModal onDismiss={handleCalendarDismiss} value={{ profession: { id: state?.add_to_project?.profession_id, name: state?.add_to_project?.profession_name }, dates: selectedDates }} onChange={handleSetDate} /> : null*/}
			{calendarViewParams?.profession ? (
				<Modal onDismiss={() => setCalendarViewParams({})}>
					<View style={{ gap: theme.gap.xxxs, paddingTop: 2 * theme.padding.base, minWidth: '100%', paddingHorizontal: theme.padding.base }}>
						<Text size="bodyBig" color="muted">
							Dates for hiring of {calendarViewParams?.profession?.name} for this project
						</Text>
						<Text color="regular" size="button">
							{formatDates(calendarViewParams?.dates)}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs, paddingTop: 2 * theme.padding.base, paddingBottom: 4 * theme.padding.base, minWidth: '100%', paddingHorizontal: theme.padding.base }}>
						<Text size="bodyBig" color="muted">
							Time for hiring of {calendarViewParams?.profession?.name} for this project
						</Text>
						<Text color="regular" size="button">
							Start Time: {moment(calendarViewParams?.from_time, 'HH:mm').format('hh:mm A')}
						</Text>
						<Text color="regular" size="button">
							End Time: {moment(calendarViewParams?.to_time, 'HH:mm').format('hh:mm A')}
						</Text>
					</View>
				</Modal>
			) : null}
			{created && <Success header={`Project Updated Successfully`} text={`Project is updated successfully and invites are sent to all the selected talents.`} onDismiss={handleSuccess} onPress={handleSuccess} />}
			{project_status !== 'Completed' && loginType === 'producer' && permissions?.includes('Project::Edit') && activeTab !== 0 && (
				<View style={{ minHeight: CONSTANTS.screenHeight * 0.09, flexDirection: 'row', flex: 1, maxHeight: CONSTANTS.screenHeight * 0.09, padding: theme.padding.base, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					{message ? (
						<Pressable onPress={() => setMessage('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.xs, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							<Text color={'error'} textAlign="center" size="bodyBig">
								{message}
							</Text>
						</Pressable>
					) : null}
					{addable && (
						<Pressable style={{ flex: 1, backgroundColor: theme.colors.backgroundLightBlack, alignItems: 'center', justifyContent: 'center', borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} onPress={() => dispatch({ type: 'CLEAR_ADD_TO_PROJECT' })}>
							<RNText style={{ fontFamily: theme.fontFamily.cgMedium, fontSize: theme.fontSize.button, color: theme.colors.typography }}>Cancel</RNText>
						</Pressable>
					)}
					{activeTab !== 2 && (
						<Pressable onPress={activeTab === 2 ? handleStudioBooking : addable ? handleAddTalent : handleAddMoreTalent} style={{ borderWidth: theme.borderWidth.slim, borderColor: addable ? theme.colors.borderGray : theme.colors.primary, flex: 1, backgroundColor: addable ? theme.colors.primary : theme.colors.transparent, justifyContent: 'center', alignItems: 'center' }}>
							<RNText style={{ fontFamily: theme.fontFamily.cgMedium, fontSize: theme.fontSize.button, color: addable ? theme.colors.black : theme.colors.primary }}>{addable ? 'Add' : 'Add Talents'}</RNText>
						</Pressable>
					)}
				</View>
			)}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
}));

/*
		for (let i = 0; i < allProfessions.length; i++) {
			const profession = { id: allProfessions[i]?.id, name: allProfessions[i]?.name };
			dispatch({ type: 'TALENT_SELECTION_ADD_PROFSSION', value: profession });

			const response = await server.get(CONSTANTS.endpoints.project_invitation_dates(projectId, profession?.id))
			const success1 = response.data?.success;
			const dates = response.data?.data;

			if (success1) {
				dispatch({ type: 'TALENT_SELECTION_DATES', value: { profession, dates } });
			}

			const res = await server.get(CONSTANTS.endpoints.get_project_invitations(projectId, profession?.id))
			const success = res.data?.success;
			const invites = res.data?.data;

			if (success) {
				for (let it of invites) {
					dispatch({
						type: 'TALENT_SELECTION_ADD_TALENT', value: {
							profession,
							talent: {
								first_name: it?.first_name,
								last_name: it?.last_name,
								id: it?.talent_id,
								profile_picture_url: it?.profile_pic_url,
								profession: profession?.id,
								profession_type: profession?.name,
								status: it?.status
							}
						}
					})
				}
			}
		}
*/
