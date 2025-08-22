import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoBookingsSvg } from '@assets/svgs/errors';

export default function NoSelfBlock() {
	const { styles } = useStyles(stylesheet);
	return (
		<ViewBox isBlack={false}>
			<View style={styles.container}>
				<NoBookingsSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						No self-blocks yet!
					</Text>
				</View>
			</View>
		</ViewBox>
	);
}
const stylesheet = createStyleSheet(theme => ({
	container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 64,
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
