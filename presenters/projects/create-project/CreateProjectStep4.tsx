// not in use
import { SafeAreaView, ScrollView, View, Text as RNText, Pressable, Platform } from 'react-native';
import { Accordion, Button, Text } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ProjectStepsIndicator from '../ProjectStepsIndicator';
import { useProjectsContext } from '../ProjectContext';
import { Bookmark, Calendar, FileUpload, LongArrowLeft } from '@touchblack/icons';
import { FlashList } from '@shopify/flash-list';
import UserItem from '@components/UserItem';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@presenters/auth/AuthContext';
import server from '@utils/axios';
import CONSTANTS from '@constants/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Success from './Success';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import lodash from 'lodash';

export default function CreateProjectStep3() {
	const { styles, theme } = useStyles(stylesheet);
	const { state, dispatch } = useProjectsContext();
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const [serverError, setServerError] = useState('');
	const [created, setCreated] = useState(false);

	function inviteProjectDatesTransformer() {
		if (state.project_details.project_id) {
			const value = [];
			for (let [index, it] of state.talent_selection_details.project_invitations.entries()) {
				//const dates = lodash.differenceWith(it.dates, state.talent_selection_details_default.project_invitations[index].dates, (new, old) => lodash.isEqual(new, old));
				const dates = lodash.differenceWith(it.dates, state.talent_selection_details_default.project_invitations[index].dates);

				const x = {
					talent_ids: it.talent_ids?.map(it => it?.id),
					profession_id: it.profession_id.id,
					project_id: state.project_details.project_id,
				};

				if (dates?.length) {
					x.dates = it?.dates;
					value.push(x);
				}
			}
			return { project_invitations: value };
		}
	}

	function inviteProjectTransformer(projectId: UniqueId) {
		try {
			if (state.project_details.project_id) {
				const value = [];
				const project_id = state.project_details.project_id;
				for (let [index, it] of state.talent_selection_details.project_invitations.entries()) {
					const talent_ids = lodash.differenceWith(it.talent_ids, state.talent_selection_details_default.project_invitations[index]?.talent_ids || [], ({ id: newId }, { id: oldId }) => lodash.eq(newId, oldId));

					const x = {
						dates: it.dates,
						profession_id: it.profession_id.id,
						project_id,
					};

					if (talent_ids?.length) {
						x.talent_ids = talent_ids?.map(that => that.id);
						value.push(x);
					}
				}
				return { project_invitations: value };
			}
		} catch (err) {}

		return {
			project_invitations: state.talent_selection_details.project_invitations.map(it => ({
				dates: it.dates,
				profession_id: it.profession_id.id,
				project_id: projectId,
				talent_ids: it.talent_ids.map(item => item.id),
			})),
		};
	}

	async function handleSubmit() {
		if (state.project_details.project_id) {
			const response2 = await server.post(CONSTANTS.endpoints.project_invitations, inviteProjectTransformer(state.project_details.project_id));
			const success2 = response2.data?.success;

			try {
				const response3 = await server.post(CONSTANTS.endpoints.update_project_dates, inviteProjectDatesTransformer());
				const success3 = response3.data?.success;
			} catch (err) {}

			if (!success2) {
				setServerError(response2.data?.message || 'Something went wrong');
			}
		} else {
			const response1 = await server.postForm(CONSTANTS.endpoints.project, createProjectTransformer());
			const success1 = response1.data?.success;
			if (!success1) {
				setServerError(response1.data?.message || 'Something went wrong');
				return;
			}

			const response2 = await server.post(CONSTANTS.endpoints.project_invitations, inviteProjectTransformer(response1.data?.data?.project_id));
			const success2 = response2.data?.success;

			if (!success2) {
				setServerError(response2.data?.message || 'Something went wrong');
				return;
			}
		}

		setCreated(true);
	}

	function handleSuccess() {
		queryClient.invalidateQueries(['useGetProducerProjects', EnumProducerStatus.Live]);
		queryClient.invalidateQueries(['useGetProducerProjects', EnumProducerStatus.Completed]);
		dispatch({ type: 'RESET' });
		navigation.reset({
			index: 0,
			routes: [{ name: 'TabNavigator' }],
		});
	}

	function handleGoBack() {
		if (created) {
			navigation.reset({
				index: 0,
				routes: [{ name: 'Projects' }],
			});
		} else {
			navigation.goBack();
		}
	}

	function handleEditDetails() {
		navigation.navigate('CreateProjectStep1');
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<View style={styles.container}>
				<View style={styles.buttonContainer}>
					<Pressable style={styles.button} onPress={handleGoBack}>
						<LongArrowLeft color={theme.colors.typography} size="24" />
					</Pressable>
					<RNText style={styles.heading}>Confirm Talent</RNText>
				</View>
			</View>
			<ProjectStepsIndicator step={2} />
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ zIndex: 1 }}
				bounces={false}
				contentContainerStyle={{
					justifyContent: 'space-between',
					gap: theme.gap.xxl,
					paddingBottom: 84,
					backgroundColor: theme.colors.backgroundDarkBlack,
				}}>
				<View style={{ paddingHorizontal: theme.padding.base, gap: theme.gap.base }}>
					<Text color="regular" size="primaryMid">
						Project Details
					</Text>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Project Name
						</Text>
						<Text color="regular" size="bodyBig">
							{state.project_details.project_name}
						</Text>
					</View>
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Film Type
						</Text>
						<Text color="regular" size="bodyBig">
							{state.project_details.video_type_id?.name}
						</Text>
					</View>
					{state.project_details.brand_id?.name ? (
						<View style={{ gap: theme.gap.xxxs }}>
							<Text color="muted" size="bodyMid">
								Brand Name
							</Text>
							<Text color="regular" size="bodyBig">
								{state.project_details.brand_id?.name}
							</Text>
						</View>
					) : null}
					{state.project_details.film_brief ? (
						<View style={{ gap: theme.gap.xxxs }}>
							<Text color="muted" size="bodyMid">
								Film Brief
							</Text>
							<Text color="regular" size="bodyBig">
								{state.project_details.film_brief}
							</Text>
						</View>
					) : null}
					{state.project_details.film_brief_attachment?.name ? (
						<View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.gap.xs, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xs, paddingHorizontal: theme.padding.base }}>
							<FileUpload size="24" color={theme.colors.muted} />
							<Text color="regular" style={{ maxWidth: '80%', paddingTop: 4 }} size="bodyBig">
								{state.project_details.film_brief_attachment?.name}
							</Text>
						</View>
					) : null}
					<View style={{ gap: theme.gap.xxxs }}>
						<Text color="muted" size="bodyMid">
							Location
						</Text>
						<Text color="regular" size="bodyBig">
							{state.project_details.location_ids.map(it => it.name).join(', ')}
						</Text>
					</View>
				</View>
				<View>
					{state.talent_selection_details.project_invitations.map(item => (
						<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
							<Accordion
								customStyles={styles.accordion}
								title={
									<View style={{ flexDirection: 'row', gap: theme.gap.sm, justifyContent: 'center', alignItems: 'center' }}>
										<RNText style={{ color: theme.colors.success, fontFamily: theme.fontFamily.cgBold, fontSize: theme.fontSize.secondary }}>{String(item.talent_ids?.length || 0).padStart(2, '0')}</RNText>
										<Text size="secondary" color="regular">
											{item.profession_id.name}
										</Text>
										<View style={{ padding: theme.padding.xs }}>
											<Calendar size="24" strokeWidth={3} color="none" strokeColor={theme.colors.typography} />
										</View>
									</View>
								}>
								<FlashList
									data={item.talent_ids || []}
									estimatedItemSize={100}
									renderItem={({ item: it }) => (
										<UserItem
											name={(it.first_name || '') + ' ' + (it.last_name || '')}
											id={it.id}
											city={it.city}
											profession={it.profession_type}
											image={createAbsoluteImageUri(it.profile_picture_url)}
											cta={<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.gap.base }}>{it.is_bookmarked ? <Bookmark size="30" color={theme.colors.primary} strokeWidth={0} /> : <Bookmark size="30" color={'none'} strokeColor={theme.colors.typography} />}</View>}
										/>
									)}
									keyExtractor={item => item.id}
								/>
							</Accordion>
						</View>
					))}
				</View>
			</ScrollView>
			<View style={{ position: 'absolute', flexDirection: 'row', bottom: 16, zIndex: 999999, right: 0, left: 0, paddingHorizontal: theme.padding.base, paddingBottom: theme.padding.xl, backgroundColor: theme.colors.backgroundDarkBlack, paddingTop: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				{serverError ? (
					<Pressable onPress={() => setServerError('')} style={{ position: 'absolute', bottom: 80, left: 0, right: 0, padding: theme.padding.base, backgroundColor: theme.colors.black, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
						<Text color={'error'} textAlign="center" size="bodyBig">
							{serverError}
						</Text>
					</Pressable>
				) : null}
				{!state.project_details.project_id ? (
					<Button type="secondary" textColor="regular" style={{ flex: 1, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} onPress={handleEditDetails}>
						Edit Details
					</Button>
				) : null}
				<Button onPress={handleSubmit} style={{ flex: 1 }}>
					{state.project_details.project_id ? 'Update' : 'Send'}
				</Button>
			</View>
			{created && <Success header={`Project ${state.project_details.project_id ? 'Updated' : 'Created'} Successfully`} text={`Project ${state.project_details.project_name} is ${state.project_details.project_id ? 'updated' : 'created'} successfully and invites are sent to all the selected talents.`} onDismiss={handleSuccess} onPress={handleSuccess} />}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	textInput: {
		backgroundColor: theme.colors.black,
		padding: theme.padding.base,
		color: theme.colors.typography,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		flex: 1,
	},
	accordion: {
		borderBottomWidth: 0,
		flex: 1,
	},
	container: {
		paddingHorizontal: theme.padding.base,
		...Platform.select({
			ios: {
				paddingBottom: theme.padding.sm,
			},
			android: {
				paddingVertical: theme.padding.sm,
			},
		}),
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	heading: {
		fontSize: theme.fontSize.primaryH2,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	buttonContainer: {
		zIndex: -9,
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		marginLeft: 0,
		backgroundColor: theme.colors.transparent,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 0,
		paddingRight: theme.padding.sm,
	},
}));
