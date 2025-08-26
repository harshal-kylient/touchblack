import { Platform, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import ProfessionsListBody from './ProfessionsListBody';
import IProfessionDto from '@models/dtos/IProfessionDto';
import ProfessionsListHeader from './ProfessionsListHeader';

type ProfessionsListProps = {
	route: {
		params: {
			professions: IProfessionDto[];
		};
	};
};

function ProfessionsList({ route }: ProfessionsListProps) {
	const { professions } = route.params;
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.filterScreenContainer}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<ProfessionsListHeader title={'Talent Role'} />
			<ProfessionsListBody data={professions} />
		</View>
	);
}

export default ProfessionsList;

const stylesheet = createStyleSheet(theme => ({
	filterScreenContainer: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingTop: Platform.OS === 'ios' ? 50 : 0,
	},
}));
