import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, Button } from '@touchblack/ui';
import GreenSearchEye from '@assets/svgs/searchEye.svg';

export type ProfileExistingSheetProps = {};

export default function ProfileExistingSheet({}: ProfileExistingSheetProps) {
	const { styles } = useStyles(stylesheet);

	function handleKeyPress() {}

	function handleNumberChange() {}

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.iconContainer}>
				<GreenSearchEye width={64} />
			</View>
			<View style={styles.bodyContainer}>
				<Text size="primaryMid" color="regular">
					Interesting!
				</Text>
				<Text textAlign="center" maxWidth={348} size="bodyBig" color="muted">
					Looks like we know you! So we started setting up your Account.
				</Text>
				<View style={styles.MobileNumberContainer}>
					<Text color="regular" size="bodyBig">
						8107664041
					</Text>
					<Button type="inline" textColor="primary" onPress={handleNumberChange}>
						Change
					</Button>
				</View>
			</View>
			<View style={styles.footer}>
				<Button onPress={handleKeyPress} style={{ width: '100%' }}>
					Claim Account
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
	MobileNumberContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.gap.xxs,
	},
	footer: {
		display: 'flex',
		width: '100%',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
