import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { UserNotFoundSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
}

export default function UserNotFound({ title = 'No User Found !', desc = 'Make sure input user name is correct !' }: IProps) {
	const { styles } = useStyles(stylesheet);
	return (
		<ViewBox isBlack={true}>
			<View style={styles.container}>
				<UserNotFoundSvg />
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
