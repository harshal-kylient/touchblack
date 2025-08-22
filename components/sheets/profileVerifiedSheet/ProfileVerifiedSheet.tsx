import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, Button } from '@touchblack/ui';
import { Verified } from '@touchblack/icons';

export type ProfileVerifiedSheetProps = {};

export default function ProfileVerifiedSheet({}: ProfileVerifiedSheetProps) {
	const { styles } = useStyles(stylesheet);
	function handleKeyPress() {}

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.iconContainer}>
				<Verified size="64" />
			</View>
			<View style={styles.bodyContainer}>
				<Text size="primaryMid" color="regular">
					Verified!
				</Text>
				<Text textAlign="center" maxWidth={348} size="bodyBig" color="muted">
					Let's go! Enter your basic details next and you're all set.
				</Text>
			</View>
			<View style={styles.footer}>
				<Button onPress={handleKeyPress} style={{ width: '100%' }}>
					Continue
				</Button>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	notificationContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	iconContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.padding.icon,
		borderRightWidth: theme.borderWidth.slim,
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	bodyContainer: {
		display: 'flex',
		width: '100%',
		gap: theme.gap.xxs,
		padding: theme.padding.base,
		textAlign: 'center',
		alignItems: 'center',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		display: 'flex',
		width: '100%',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
