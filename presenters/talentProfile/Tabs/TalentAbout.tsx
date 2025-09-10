import { View, ScrollView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useAuth } from '@presenters/auth/AuthContext';
import IInstitute from '@models/entities/IInstitute';
import { Text } from '@touchblack/ui';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import useGetTalentAwards from '@network/useGetTalentAwards';
import useGetLanguages from '@network/useGetLanguages';

const TalentAbout = ({ talentId, paddingBottom }: { talentId: UniqueId; paddingBottom: number }) => {
	const { styles } = useStyles(stylesheet);
	const { userId } = useAuth();
	const { data: talentData } = useGetUserDetailsById('User', talentId);
	const myProfile = userId === talentData?.user_id;

	const { data: response } = useGetTalentAwards(talentId);
	const talentAwards = response?.data;
	const formatAwards = (awards: any) => {
		return awards.map(it => `${it.award.name}\n${it.film.film_name}\n${it.year_of_award}`).join('\n\n');
	};

	const formatUniversity = (institutes: IInstitute[]) => {
		const convertedArray = institutes.map((item: IInstitute) => ({
			university_name: item.name,
			year_of_graduation: item.year_of_graduation,
		}));
		return convertedArray.map((item: any) => `${item.university_name}\n${item.year_of_graduation}`).join('\n\n');
	};
	function formatLanguages(languages: string[]): string {
		return languages.join(', ');
	}

	const tableData = [
		['Name', talentData ? `${talentData.first_name ?? '-'} ${talentData.last_name ?? '-'}` : '-'],
		['Talent role', talentData?.talent_role ?? '-'],
		['Bio', talentData?.bio ?? '-'],
		['D.O.B', talentData?.dob ?? '-'],
		['Gender', talentData?.gender ?? '-'],
		['Languages', talentData?.user_languages?.length ? formatLanguages(talentData?.user_languages) : '-'],
		['Rate per project', talentData?.rate ? `\u20B9 ${talentData.rate} onwards` : '-'],
		['Home Location', talentData?.city && talentData?.state ? `${talentData.city}, ${talentData.state}` : '-'],
		['Education', talentData?.institutes?.length ? formatUniversity(talentData.institutes) : '-'],
		['Awards', talentAwards?.length ? formatAwards(talentAwards) : '-'],
	];

	if (myProfile) {
		tableData.push(['Mobile No.', talentData?.mobile_number ?? '-']);
	}

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.container, { paddingBottom }]}>
			{tableData.map((it, index) => (
				<Element key={index} heading={it[0]} text={it[1]} />
			))}
		</ScrollView>
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
		flexGrow: 1,
		backgroundColor: theme.colors.black,
		padding: theme.padding.xxl,
		marginBottom: theme.margins.base,
	},
}));

export default TalentAbout;
