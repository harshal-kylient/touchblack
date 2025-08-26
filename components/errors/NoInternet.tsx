import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoInternetSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
}

export default function NoInternet({ title = 'Unable to load page !', desc = 'Please check your network connection and try again.' }: IProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<ViewBox isBlack={false}>
			<View style={styles.container}>
				<NoInternetSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						{title}
					</Text>
					<Text size="bodyBig" color="muted" textAlign="center">
						{desc}
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
