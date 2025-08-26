import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import useGetProjectStudiosList from '@network/useGetProjectStudiosList';
import StudioCardView from '@presenters/studio/booking/StudioCardView';
import { FlashList } from '@shopify/flash-list';
import { Accordion, Text } from '@touchblack/ui';
import capitalized from '@utils/capitalized';
import { ActivityIndicator, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';

interface IProps {
	project_id: UniqueId;
}

export default function ProjectStudiosList({ project_id }: IProps) {
	const { theme } = useStyles();
	const { data, isLoading } = useGetProjectStudiosList(project_id);

	if (isLoading) return <ActivityIndicator color={theme.colors.primary} />;

	return (
		<FlashList
			data={Object.entries(data)}
			estimatedItemSize={90}
			ListEmptyComponent={
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text color="muted" size="button">
						No Studios booked yet
					</Text>
				</View>
			}
			renderItem={({ item }) => (
				<Accordion
					customStyles={{ backgroundColor: theme.colors.black }}
					title={
						<View style={{ flexDirection: 'row', justifyContent: 'center', gap: theme.gap.xs, alignItems: 'center' }}>
							<Text size="secondary" color="regular">
								{item[0]}
							</Text>
						</View>
					}>
					{item[1]?.map(item => (
						<StudioCardView
							project_id={project_id}
							item={item?.studio_floor_info}
							cta={
								<Text size="bodyBig" style={{ color: item?.status === EnumStudioStatus.Enquiry ? theme.colors.success : item?.status === EnumStudioStatus.Confirmed ? theme.colors.destructive : item?.status === EnumStudioStatus.Tentative ? theme.colors.primary : theme.colors.muted }}>
									{capitalized(item?.status)}
								</Text>
							}
						/>
					))}
				</Accordion>
			)}
			keyExtractor={(item, index) => String(index)}
		/>
	);

	return (
		<FlashList
			data={data}
			estimatedItemSize={131}
			renderItem={({ item }) => <StudioCardView item={item} id={item?.id} />}
			keyExtractor={(item, index) => String(index)}
			ListEmptyComponent={
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text color="muted" size="button">
						No Studios booked yet
					</Text>
				</View>
			}
		/>
	);
}
