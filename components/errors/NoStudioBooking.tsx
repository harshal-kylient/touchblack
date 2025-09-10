import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import ViewBox from '@components/ViewBox';
import { NoStudioBookingSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
}

export default function NoStudioBooking({ title = 'No bookings yet !', desc = 'Keep your profile updated to get more bookings' }: IProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<ViewBox isBlack={false}>
			<View style={styles.container}>
				<NoStudioBookingSvg />
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
