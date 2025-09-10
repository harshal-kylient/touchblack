import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Text } from '@touchblack/ui';
import { LongArrowLeft } from '@touchblack/icons';

interface ProfessionsListHeaderProps {
	title: string;
}

function ProfessionsListHeader({ title }: ProfessionsListHeaderProps) {
	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation();

	return (
		<View style={styles.header}>
			<TouchableOpacity
				onPress={() => {
					navigation.goBack();
				}}>
				<LongArrowLeft size="24" color="white" />
			</TouchableOpacity>
			<Text size="primaryMid" color="regular">
				{title}
			</Text>
		</View>
	);
}

export default ProfessionsListHeader;

const stylesheet = createStyleSheet(theme => ({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.base,
		padding: theme.padding.base,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
