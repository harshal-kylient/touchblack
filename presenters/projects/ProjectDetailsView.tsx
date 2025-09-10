import CONSTANTS from '@constants/constants';
import useGetProjectDates from '@network/useGetProjectDates';
import useGetProjectDetails from '@network/useGetProjectDetails';
import useGetTalentDetails from '@network/useGetTalentDetails';
import { useAuth } from '@presenters/auth/AuthContext';
import { Download } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import capitalized from '@utils/capitalized';
import { formatDates } from '@utils/formatDates';
import { Linking, Pressable, ScrollView, View } from 'react-native';

interface IProps {
	id: UniqueId;
}

export default function ProjectDetailsView({ id }: IProps) {
	const theme = darkTheme;
	const { userId, loginType } = useAuth();
	const { data: project_details } = useGetProjectDetails(id);

	const { data: response2 } = useGetTalentDetails(userId!);
	const talentDetails = response2?.data;
	const professionId = talentDetails?.profession_type;

	const { data: response3 } = useGetProjectDates(id, professionId);
	const dates = response3?.data;

	return (
		<ScrollView contentContainerStyle={{ paddingHorizontal: theme.padding.base, gap: theme.gap.base }}>
			<View style={{ gap: theme.gap.xxxs }}>
				<Text color="muted" size="bodyMid">
					Project Name
				</Text>
				<Text color="regular" size="bodyBig">
					{capitalized(project_details?.project_name)}
				</Text>
			</View>
			<View style={{ gap: theme.gap.xxxs }}>
				<Text color="muted" size="bodyMid">
					Film Type
				</Text>
				<Text color="regular" size="bodyBig">
					{project_details?.video_type?.name}
				</Text>
			</View>
			{project_details?.brand?.name ? (
				<View style={{ gap: theme.gap.xxxs }}>
					<Text color="muted" size="bodyMid">
						Brand Name
					</Text>
					<Text color="regular" size="bodyBig">
						{project_details?.brand?.name}
					</Text>
				</View>
			) : null}
			{project_details?.film_brief ? (
				<View style={{ gap: theme.gap.xxxs }}>
					<Text color="muted" size="bodyMid">
						Film Brief
					</Text>
					<Text color="regular" size="bodyBig">
						{project_details?.film_brief}
					</Text>
				</View>
			) : null}
			{project_details?.film_brief_attachment_url ? (
				<View style={{ gap: theme.gap.xxxs }}>
					<Text color="muted" size="bodyMid">
						Film Brief Attachment
					</Text>
					<Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.base }} onPress={() => Linking.openURL(CONSTANTS.DOMAIN + project_details?.film_brief_attachment_url)}>
						<Text color="regular" size="bodyBig" style={{ maxWidth: '85%' }}>
							{decodeURIComponent(project_details?.film_brief_attachment_url?.split('/')?.pop())}
						</Text>
						<Download size="24" />
					</Pressable>
				</View>
			) : null}
			<View style={{ gap: theme.gap.xxxs }}>
				<Text color="muted" size="bodyMid">
					Location
				</Text>
				<Text color="regular" size="bodyBig">
					{project_details?.location.map(it => it?.name).join(', ')}
				</Text>
			</View>
			{loginType === 'talent' ? (
				<View style={{ gap: theme.gap.xxxs }}>
					<Text color="muted" size="bodyMid">
						Dates
					</Text>
					<Text color="regular" size="bodyBig">
						{formatDates(dates)}
					</Text>
				</View>
			) : null}
		</ScrollView>
	);
}
