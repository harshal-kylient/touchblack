import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { NoProjectsSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
	width?: number;
	height?: number;
}
export default function NoProjects({ title = 'No Projects', desc = '---', width = 253, height = 230 }: IProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.container}>
			<NoProjectsSvg width={width} height={height} />
			<View style={styles.textWrapper}>
				<Text size="primaryMid" color="regular" textAlign="center">
					{title}
				</Text>
				<Text size="bodyBig" color="muted" textAlign="center">
					{desc}
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
	},
	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
