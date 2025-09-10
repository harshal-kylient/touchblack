import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { NoMessageSvg } from '@assets/svgs/errors';

interface IProps {
	title?: string;
	desc?: string;
}

export default function NoMessages({ title = 'No messages yet!', desc = 'Start a conversation with a talent!' }: IProps) {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.outerContainer}>
			<View style={styles.innerContainer}>
				<NoMessageSvg />
				<View style={styles.textWrapper}>
					<Text size="primaryMid" color="regular" textAlign="center">
						{title}
					</Text>
					<Text size="bodyBig" color="muted" textAlign="center">
						{desc}
					</Text>
				</View>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	outerContainer: {
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingVertical: 1,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},

	innerContainer: {
		backgroundColor: theme.colors.black,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		paddingVertical: theme.padding.xxxxl,
		gap: 64, 
	},

	textWrapper: {
		alignSelf: 'center',
		gap: theme.gap.xxs,
		paddingHorizontal: theme.padding.base,
	},
}));
