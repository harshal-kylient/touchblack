import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoStudioSvg } from '@assets/svgs/errors';

export default function NoStudios() {
	const { styles } = useStyles(stylesheet);
	return (
		<ViewBox isBlack={false}>
			<View style={styles.container}>
				<NoStudioSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						No studios added yet !
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
