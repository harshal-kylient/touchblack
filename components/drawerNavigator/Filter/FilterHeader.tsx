import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { LongArrowLeft } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';

function FilterHeader() {
	const { styles } = useStyles(stylesheet);
	const navigation = useNavigation();

	return (
		<View style={styles.header}>
			<Pressable onPress={() => navigation.goBack()}>
				<LongArrowLeft color="white" size="24" />
			</Pressable>
			<Text size="primaryMid" color="regular">
				Filters
			</Text>
		</View>
	);
}

export default FilterHeader;

const stylesheet = createStyleSheet(theme => ({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.base,
		padding: theme.padding.base,
		paddingBottom: 42,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
}));
