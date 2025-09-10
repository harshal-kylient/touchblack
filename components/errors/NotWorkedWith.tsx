import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NotWorkedWithSvg } from '@assets/svgs/errors';

export default function NotWorkedWith() {
	const { styles } = useStyles(stylesheet);
	return (
		<ViewBox isBlack={true}>
			<View style={styles.container}>
				<NotWorkedWithSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						Not worked with anyone yet !
					</Text>
					<Text size="bodyBig" color="regular" textAlign="center">
						Let&apos;s Add professionals to the team !
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
