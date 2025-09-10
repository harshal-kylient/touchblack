import UserItem from '@components/UserItem';
import EnumStatus from '@models/enums/EnumStatus';
import useGetProjectInvitations from '@network/useGetProjectInvitations';
import { useNavigation } from '@react-navigation/native';
import { Accordion, Text } from '@touchblack/ui';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { View, Text as RNText, FlatList, Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Calendar } from '@touchblack/icons';
import useGetProjectDates from '@network/useGetProjectDates';

interface IProps {
	projectId: UniqueId;
	profession: any;
	index: number;
	status: EnumStatus;
	onCalendarPress: () => void;
}

export default function ProjectInvitationByProfession({ projectId, profession, index, status, onCalendarPress }: IProps) {
	const { styles, theme } = useStyles(stylesheet);
	const { data: response } = useGetProjectInvitations(projectId, profession.id, status);
	const data = response?.pages?.flatMap(page => page?.data) || [];
	const navigation = useNavigation();
	const { data: datesResponse } = useGetProjectDates(projectId, profession.id);
	const dates = datesResponse?.data?.map(it => it?.[0]);
	const from_time = datesResponse?.data?.[0]?.[1];
	const to_time = datesResponse?.data?.[0]?.[2];

	return (
		<View style={{ flex: 1, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
			<Accordion
				customStyles={styles.accordion}
				title={
					<View style={{ flexDirection: 'row', gap: theme.gap.xs, justifyContent: 'center', alignItems: 'center' }}>
						<RNText style={{ color: theme.colors.success, fontFamily: theme.fontFamily.cgBold, fontSize: theme.fontSize.secondary }}>{String(profession?.count || 0).padStart(2, '0')}</RNText>
						<Text size="secondary" color="regular">
							{profession?.name}
						</Text>
						<Pressable onPress={() => onCalendarPress({ profession, dates, from_time, to_time })} style={{ padding: theme.padding.xs }}>
							<Calendar size="20" strokeWidth={3} color="none" strokeColor={theme.colors.typography} />
						</Pressable>
					</View>
				}>
				<FlatList
					data={data}
					renderItem={({ item: it }) => (
						<UserItem
							name={(it.first_name || '') + ' ' + (it.last_name || '')}
							id={it.talent_id}
							city={it.locations}
							profession={profession?.name}
							image={createAbsoluteImageUri(it.profile_pic_url)}
							onPress={() => navigation.navigate('ProjectConversation', { receiver_id: it.talent_id, project_id: projectId, id: it.conversation_id })}
							cta={
								<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.gap.base }}>
									{it.status === EnumStatus.Enquiry ? (
										<Text size="bodyBig" style={{ color: theme.colors.success }}>
											{it.status}
										</Text>
									) : it.status === EnumStatus.Confirmed ? (
										<Text size="bodyBig" color="error">
											{it.status}
										</Text>
									) : it.status === EnumStatus.Opted_out ? (
										<Text size="bodyBig" color="muted">
											{it.status}
										</Text>
									) : it.status === EnumStatus.Tentative ? (
										<Text size="bodyBig" style={{ color: theme.colors.primary }}>
											{it.status}
										</Text>
									) : it.status === EnumStatus.Not_available ? (
										<Text size="bodyBig" color="muted">
											{it.status}
										</Text>
									) : null}
								</View>
							}
						/>
					)}
					keyExtractor={item => item.id}
				/>
			</Accordion>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	accordion: {
		borderBottomWidth: 0,
		paddingVertical: theme.padding.xxxs,
		backgroundColor: theme.colors.black,
	},
}));
