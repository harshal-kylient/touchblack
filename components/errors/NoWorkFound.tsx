import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoWorkFoundSvg } from '@assets/svgs/errors';

export default function NoWorkFound() {
	const { styles } = useStyles(stylesheet);
	return (
		<ViewBox isBlack={true}>
			<View style={styles.container}>
				<NoWorkFoundSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						No work !
					</Text>
					<Text size="bodyBig" color="regular" textAlign="center">
						Let&apos;s add best work from your collection!
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
