import { useCallback, useMemo } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Text } from '@touchblack/ui';
import { Download } from '@touchblack/icons';
import useGetProjectDates from '@network/useGetProjectDates';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';
import { formatDates } from '@utils/formatDates';
import IMessageItem from '@models/entities/IMessageItem';
import CONSTANTS from '@constants/constants';
import { SheetType } from 'sheets';
import { useQueryClient } from '@tanstack/react-query';
import EnumProjectStatus from '@models/enums/EnumProjectStatus';
import { useTalentContext } from '@presenters/assignManager/ManagerTalentContext';

interface TemplateMessageProps {
	item: IMessageItem;
	status: EnumProjectStatus;
	project_id: UniqueId;
	party1_id: UniqueId;
	party2_id: UniqueId;
	conversation_id: UniqueId;
	project_invitation_id: UniqueId;
}

export default function TemplateMessage({ item: message, party1_id, party2_id, status, project_id, conversation_id, project_invitation_id }: TemplateMessageProps) {
	const { theme } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const item = message?.content;
	const talentId = party1_id;
	const queryClient = useQueryClient();
	const { data: talentData } = useGetTalentDetails(talentId);
	const { selectedTalent } = useTalentContext();
	const profession_id = loginType === 'manager' ? selectedTalent?.talent?.profession_type : talentData?.data?.profession_type;
	const { data } = useGetProjectDates(project_id, profession_id);
	const dates = data?.data?.map(it => it?.[0]);
	const from_time = data?.data?.[0]?.[1];
	const to_time = data?.data?.[0]?.[2];


	const handleOptOut = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.OptOut,
				data: {
					invitation_id: project_invitation_id,
					conversation_id,
					onSuccess: async () => {
						await queryClient.invalidateQueries('useGetTalentCalendarList');
						await queryClient.invalidateQueries('useGetProducerCalendarList');
					},
				},
			},
		});
	}, [project_invitation_id, conversation_id]);

	const handleInterested = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.Negotiation,
				data: {
					conversation_id,
					project_name: capitalized(item?.project_name),
					onSuccess: async () => {
						await queryClient.invalidateQueries('useGetTalentCalendarList');
						await queryClient.invalidateQueries('useGetProducerCalendarList');
					},
				},
			},
		});
	}, [conversation_id, item?.project_name]);

	const filmBriefUrlComponent = useMemo(() => {
		if (!item?.film_brief_url) {
			return null;
		}
		return (
			<View style={{ gap: theme.gap.xxxs }}>
				<Text size="primarySm" color="muted">
					Film Brief Attachment
				</Text>
				<Pressable style={{ maxWidth: '80%', flexDirection: 'row', alignItems: 'flex-start', gap: theme.gap.base }} onPress={() => Linking.openURL(CONSTANTS.DOMAIN + item?.film_brief_url)}>
					<Text color="regular" size="bodyBig">
						{decodeURIComponent(item?.film_brief_url?.split('/')?.pop())}
					</Text>
					<Download size="24" />
				</Pressable>
			</View>
		);
	}, [item?.film_brief_url, theme.gap]);

	return (
		<>
			<View style={{ padding: theme.padding.base, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text size="primarySm" color={'regular'}>
					{item?.message}
				</Text>
			</View>
			<View style={{ padding: theme.padding.base, gap: theme.gap.xl }}>
				{item?.brand_name ? (
					<View style={{ gap: theme.gap.xxxs }}>
						<Text size="primarySm" color="muted">
							Brand Name
						</Text>
						<Text size="primarySm" color="regular">
							{item?.brand_name}
						</Text>
					</View>
				) : null}
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Project Name
					</Text>
					<Text size="primarySm" color="regular">
						{item?.project_name}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Film Type
					</Text>
					<Text size="primarySm" color="regular">
						{item?.film_type}
					</Text>
				</View>
				{item?.film_brief ? (
					<View style={{ gap: theme.gap.xxxs }}>
						<Text size="primarySm" color="muted">
							Film Brief
						</Text>
						<Text size="primarySm" color="regular">
							{item?.film_brief}
						</Text>
					</View>
				) : null}
				{filmBriefUrlComponent}
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Location
					</Text>
					<Text size="primarySm" color="regular">
						{item?.location?.map(it => it?.name)?.join(', ')}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Date
					</Text>
					<Text size="primarySm" color="regular">
						{formatDates(dates)}
					</Text>
				</View>
				<View style={{ gap: theme.gap.xxxs }}>
					<Text size="primarySm" color="muted">
						Time Slot
					</Text>
					<Text size="primarySm" color="regular">
						{from_time} - {to_time}
					</Text>
				</View>
			</View>
			{loginType !== 'producer' && (
				<View style={{ flexDirection: 'row' }}>
					<Button
						isDisabled={status === EnumProjectStatus.Opted_out}
						onPress={handleOptOut}
						type="secondary"
						textColor="regular"
						style={{
							flex: 1,
							opacity: status === EnumProjectStatus.Opted_out ? 0.6 : 1,
							borderRightWidth: theme.borderWidth.slim,
							borderTopWidth: theme.borderWidth.slim,
							borderColor: theme.colors.borderGray,
						}}>
						Opt Out
					</Button>
					<Button
						isDisabled={status !== EnumProjectStatus.Enquiry}
						onPress={handleInterested}
						type="primary"
						style={{
							flex: 1,
							opacity: status !== EnumProjectStatus.Enquiry ? 0.6 : 1,
							borderRightWidth: theme.borderWidth.slim,
							borderTopWidth: theme.borderWidth.slim,
							borderColor: theme.colors.borderGray,
						}}>
						Interested
					</Button>
				</View>
			)}
		</>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
	},
	messagesList: {
		paddingHorizontal: theme.padding.base,
	},
	messageContainer: (isMe: boolean) => ({
		alignSelf: isMe ? 'flex-end' : 'flex-start',
		backgroundColor: isMe ? '#50483B' : theme.colors.backgroundLightBlack,
		marginVertical: theme.margins.xs,
		maxWidth: '80%',
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	}),
	messageText: {
		// color: theme.colors.typography,
	},
	timestamp: {
		color: theme.colors.muted,
		fontSize: 10,
		alignSelf: 'flex-start',
		marginTop: 4,
	},
	inputContainer: {
		paddingVertical: 6,
		paddingLeft: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		marginBottom: theme.margins.base,
	},
	input: (height: number) => ({
		height,
		color: theme.colors.typography,
		flex: 1,
	}),
}));
