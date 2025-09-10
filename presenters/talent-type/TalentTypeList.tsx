import MediumGridPlaceholder from '@components/loaders/MediumGridPlaceholder';
import useGetAllTalentTypes from '@network/useGetAllTalentTypes';
import { SafeAreaView } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function TalentTypeList() {
	const { isLoading } = useGetAllTalentTypes();
	const { styles } = useStyles(stylesheet);

	if (isLoading) return <MediumGridPlaceholder />;

	return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
