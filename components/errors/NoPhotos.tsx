import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoInvoicesSvg } from '@assets/svgs/errors';

export default function NoPhotos() {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.container}>
			<NoInvoicesSvg />
			<View style={styles.textWrapper}>
				<Text size="primaryMid" color="regular" textAlign="center">
					No photos found !
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
		paddingVertical: theme.padding.base,
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
