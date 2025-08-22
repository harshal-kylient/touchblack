import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { NoEnquiriesSvg } from '@assets/svgs/errors';

export default function NoEnquiries() {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container}>
			<NoEnquiriesSvg />
			<View style={styles.textWrapper}>
				<Text size="primaryMid" color="regular" textAlign="center">
					No requests Yet!
				</Text>
			</View>
		</View>
	);
}
const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 64,
		paddingTop: 30,
		paddingBottom: 200,
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
