import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, Button } from '@touchblack/ui';
import GreenUnlock from '@assets/svgs/greenUnlock.svg';

export type ProfileVerifyingSheetProps = {};

export default function ProfileVerifyingSheet({}: ProfileVerifyingSheetProps) {
	const { styles } = useStyles(stylesheet);

	function handleKeyPress() {}

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.iconContainer}>
				<GreenUnlock width={64} />
			</View>
			<View style={styles.bodyContainer}>
				<Text size="primaryMid" color="regular">
					Got that!
				</Text>
				<Text textAlign="center" maxWidth={348} size="bodyBig" color="muted">
					While we complete the verification, Talent Grid and start looking for your dream crew.
				</Text>
			</View>
			<View style={styles.footer}>
				<Button onPress={handleKeyPress} style={{ width: '100%' }}>
					Explore
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
