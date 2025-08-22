import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { UpcomingSvg } from '@assets/svgs/errors';

export default function Upcoming() {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}>
				<View style={{padding:35}}>
					<UpcomingSvg />
					<View style={styles.textWrapper}>
						<Text size="primaryMid" color="regular" textAlign="center">
							Content loading !
						</Text>
						<Text size="bodyBig" color="regular" textAlign="center">
							Our new feature is almost here. Stay tuned !
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
const stylesheet = createStyleSheet(theme => ({
	container: {
		alignItems: 'center',
		gap: 64,
		justifyContent: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
		paddingHorizontal: 16,
		// paddingVertical: 16,
	},
	subContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
