import IAward from '@models/entities/IAward';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { Text } from '@touchblack/ui';
import capitalized from '@utils/capitalized';
import useGetProducerDetails from '@network/useGetProducerDetails';
import useGetProducerAwards from '@network/useGetProducerAwards';
import { useAuth } from '@presenters/auth/AuthContext';

const BusinessDetails = ({ producerId, paddingBottom }: { producerId: string; paddingBottom: number }) => {
	const { styles } = useStyles(stylesheet);
	const { producerId: loggedInProducerId } = useAuth();
	const { data: response1 } = useGetProducerDetails(producerId);
	const producerData = response1?.data;
	const { data: response2 } = useGetProducerAwards(producerId);
	const producerAwardsData = response2?.data;

	const formatProducerAwards = (awards: IAward[]) => {
		return awards.map(it => `${it?.award?.name}\n${it?.film?.film_name}\n${it?.year_of_award}`).join('\n\n');
	};

	const tableData = [['Owner Name', producerData?.owner_name]];

	if (producerId === loggedInProducerId) {
		tableData.push(['GST TIN No.', producerData?.gst_number ?? '-']);
		tableData.push(['PAN No.', producerData?.pan_number ?? '-']);
	}

	tableData.push(['Bio', producerData?.bio ?? '-'], ['Address', producerData?.locations || '-'], ['Business Type', capitalized(producerData?.producer_type?.replace('_', ' ')) || '-'], ['Awards', producerAwardsData?.length ? formatProducerAwards(producerAwardsData) : '-']);

	return (
		<View style={[styles.container, { paddingBottom }]}>
			{tableData.map((it, index) => (
				<Element key={index} heading={it[0]} text={it[1]} />
			))}
		</View>
	);
};

function Element({ heading, text }: { heading: string; text: string }) {
	const { theme } = useStyles(stylesheet);
	return (
		<View style={{ flexDirection: 'row', paddingHorizontal: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
			<View style={{ backgroundColor: theme.colors.backgroundDarkBlack, minWidth: 113, maxWidth: 113, padding: theme.padding.base, borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text color="regular" size="bodyMid">
					{heading}
				</Text>
			</View>
			<View style={{ backgroundColor: theme.colors.black, flex: 1, padding: theme.padding.base, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
				<Text color="regular" size="bodyMid">
					{text}
				</Text>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		minHeight: '100%',
		backgroundColor: theme.colors.black,
		paddingTop: theme.padding.xxl,
	},
}));

export default BusinessDetails;
