import Header from '@components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useProjectsContext } from '../ProjectContext';
import { Bookmark, Calendar, Close, LongArrowLeft } from '@touchblack/icons';
import SearchInput from '@components/SearchInput';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import useGetProjectTalents from '@network/useGetProjectTalents';
import UserItem from '@components/UserItem';
import IAvailableTalent from '@models/dtos/IAvailableTalent';
import { ActivityIndicator, RefreshControl, View } from 'react-native';
import { Button, Text } from '@touchblack/ui';
import { Pressable } from 'react-native';
import CheckBox from '@components/Checkbox';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import CONSTANTS from '@constants/constants';
import UserNotFound from '@components/errors/UserNotFound';
import { useNavigation } from '@react-navigation/native';
import { formatDates } from '@utils/formatDates';
import moment from 'moment';
import server from '@utils/axios';
import Modal from '@components/Modal';
import Info from '@components/Info';
import { useQueryClient } from '@tanstack/react-query';

export default function ProjectTalentSearch({ route }) {
	const [open, setOpen] = useState(false);
	const { styles, theme } = useStyles(stylesheet);
	const profession = route.params.profession;
	const { state, dispatch } = useProjectsContext();
	const navigation = useNavigation();
	const invite_details = state.talent_selection_details.project_invitations.filter(it => it?.profession_id?.id === profession.id)?.[0];
	const queryClient = useQueryClient();
	const header = invite_details.talent_ids.length ? `${invite_details.talent_ids.length} ${profession.name} Selected` : `Select ${profession.name}`;

	const [query, setQuery] = useState('');
	const [error, setError] = useState('');
	const { data: response, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage, refetch: mutate, isFetching } = useGetProjectTalents(query, profession.name.toLowerCase(), invite_details.dates);
	const data = response?.pages?.flatMap(page => page?.results)?.map(it => ({ id: it.id, location_name: it.location_name, profile_picture_url: it.profile_picture_url, first_name: it.first_name, last_name: it.last_name, city: it.city, profession_type: it.profession_type, is_bookmarked: it.is_bookmarked })) || [];

	function isSelected(item: IAvailableTalent): boolean {
		const project = state.talent_selection_details.project_invitations.find(it => it.profession_id.id === profession.id);
		return Boolean(project?.talent_ids?.some(it => it.id === item.id));
	}

	function handleSelect(item: IAvailableTalent) {
		for (let it of state.talent_selection_details_default.project_invitations) {
			if (it.profession_id.id !== profession.id) continue;
			for (let talent of it.talent_ids) {
				if (talent.id === item.id) return;
			}
		}

		dispatch({ type: isSelected(item) ? 'TALENT_SELECTION_REMOVE_TALENT_KEEP_PROFESSION' : 'TALENT_SELECTION_ADD_TALENT', value: { profession, talent: item } });
	}

	function handleCancel() {
		dispatch({ type: 'TALENT_SELECTION_REMOVE_ALL_TALENTS', value: { profession } });
	}

	function inviteProjectTransformer(projectId: UniqueId) {
		const result: any[] = [];
		state.talent_selection_details.project_invitations.forEach(it =>
			result.push({
				project_invitations: {
					dates: it.dates,
					start_time: it.from_time,
					end_time: it.to_time,
					profession_id: it.profession_id.id,
					project_id: projectId,
					talent_ids: it.talent_ids.map(item => item.id),
				},
			}),
		);

		return result;
	}

	const project = state.talent_selection_details.project_invitations.find(it => it.profession_id.id === profession.id);
	async function handleSubmit() {
		if (project?.talent_ids.length === 0) {
			setError(`Please select at least 1 ${profession.name.toLowerCase()}`);
			return;
		}
		// send invitations to talents
		const payloads = inviteProjectTransformer(state.project_details.project_id!);

		const invitationPromises = payloads.map(payload => server.post(CONSTANTS.endpoints.project_invitations, payload));

		const responses = await Promise.allSettled(invitationPromises);

		responses.forEach((response, index) => {
			if (response.status !== 'fulfilled') {
				setError(response.reason || 'Something went wrong');
			} else {
				queryClient.invalidateQueries(['useGetProducerCalendarList']);
				setOpen(true);
			}
		});
	}

	const formattedDates = useMemo(() => {
		return formatDates(invite_details.dates);
	}, [invite_details.dates]);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.backgroundDarkBlack }}>
			<Header name={header} />
			<Modal visible={open} onDismiss={() => setOpen(false)}>
				<Info
					header="Enquiry Sent"
					text={`Enquiry has been sent to ${project?.talent_ids?.length} ${profession.name}`}
					onSuccess={() => {
						setOpen(false);
						navigation.goBack();
					}}
				/>
			</Modal>
			<SearchInput placeholderText={`Search ${profession.name}...`} searchQuery={query} setSearchQuery={setQuery} />
			<FlashList
				data={data}
				renderItem={({ item, index }) => (
					<UserItem
						name={(item.first_name || '') + ' ' + (item.last_name || '')}
						id={item.id}
						onPress={() => navigation.navigate('TalentProfile', { id: item?.id })}
						city={item.city}
						profession={item.profession_type}
						image={createAbsoluteImageUri(item.profile_picture_url)}
						cta={
							<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.gap.base }}>
								{item?.is_bookmarked ? <Bookmark size="24" color={theme.colors.primary} strokeColor={theme.colors.primary} strokeWidth={2} /> : null}
								<CheckBox value={isSelected(item)} onChange={() => handleSelect(item)} />
							</View>
						}
					/>
				)}
				estimatedItemSize={70}
				refreshControl={<RefreshControl refreshing={isFetching} onRefresh={mutate} />}
				keyExtractor={item => item?.id || ''}
				onEndReached={() => {
					if (!isLoading && hasNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.5}
				ListEmptyComponent={
					isLoading ? (
						<ActivityIndicator color={theme.colors.primary} />
					) : (
						<View style={{ flex: 1, height: (5.5 * CONSTANTS.screenHeight) / 10, justifyContent: 'center' }}>
							<UserNotFound title={`No ${profession.name} Found !`} desc={`Make sure input ${profession.name.toLowerCase()} name is correct !`} />
						</View>
					)
				}
				ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
			/>
			<View style={styles.footer}>
				{error ? (
					<Pressable onPress={() => setError('')} style={{ justifyContent: 'center', alignItems: 'center', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xxs }}>
						<Text color="error" size="bodyBig">
							{error}
						</Text>
					</Pressable>
				) : null}
				<View style={styles.dateContainer}>
					<Calendar color="none" size="20" strokeWidth={2} strokeColor={theme.colors.typography} />
					<View style={{ flex: 1 }}>
						<Text color="regular" style={{ opacity: 0.8, maxWidth: '90%' }} size="inputLabel">
							You are booking the {profession.name} for {invite_details.dates.length} days for time {moment(invite_details.from_time, 'HH:mm').format('hh:mm A')} - {moment(invite_details.to_time, 'HH:mm').format('hh:mm A')}.
						</Text>
						<Text color="regular" style={{ opacity: 0.8, maxWidth: '90%' }} size="inputLabel">
							Dates: {formattedDates}
						</Text>
					</View>
				</View>
				<View style={styles.buttonContainer}>
					<Button
						type="secondary"
						textColor={'regular'}
						onPress={() => {
							handleCancel();
							navigation.goBack();
						}}
						style={styles.disabledButton}>
						Cancel
					</Button>
					<Button onPress={handleSubmit} style={styles.button}>
						Proceed
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	footer: {
		backgroundColor: theme.colors.black,
		borderTopColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		zIndex: 30,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
		backgroundColor: theme.colors.backgroundDarkBlack,
		gap: theme.gap.base,
	},
	buttonContainer: {
		flexDirection: 'row',
		margin: theme.padding.base,
		backgroundColor: theme.colors.black,
	},
	button: {
		flexGrow: 1,
		borderColor: theme.colors.primary,
		borderWidth: theme.borderWidth.slim,
		textDecorationLine: 'none',
	},
	disabledButton: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flexGrow: 1,
		borderColor: theme.colors.muted,
		borderWidth: theme.borderWidth.slim,
	},
}));
