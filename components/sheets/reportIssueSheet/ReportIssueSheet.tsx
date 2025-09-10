import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text, Button } from '@touchblack/ui';

export type ReportIssueSheetProps = {};

export default function ReportIssueSheet({}: ReportIssueSheetProps) {
	const { styles } = useStyles(stylesheet);

	function handleKeyPress() {}

	return (
		<View style={styles.notificationContainer}>
			<View style={styles.header}>
				<Text size="primaryMid" color="error">
					Report a Film Issue
				</Text>
				<Text size="bodyBig" color="muted">
					See something wrong? Help us improve the platform. Report inaccurate information, inappropriate content, or missing details for this film.
				</Text>
			</View>
			<View style={styles.bodyContainer}>
				<Text size="inputLabel" color="regular">
					Why are you reporting this film?
				</Text>
				<Text size="inputLabel" color="error">
					Placeholder for input text area
				</Text>
			</View>
			<View style={styles.footer}>
				<Button onPress={handleKeyPress} type="secondary" textColor="regular" style={{ width: '50%' }}>
					Cancel
				</Button>
				<Button onPress={handleKeyPress} type="primary" style={{ width: '50%' }}>
					Report
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
	header: {
		display: 'flex',
		alignItems: 'flex-start',
		gap: theme.gap.xxs,
		width: '100%',
		padding: theme.padding.base,
	},
	bodyContainer: {
		display: 'flex',
		width: '100%',
		textAlign: 'center',
		alignItems: 'flex-start',
		padding: theme.padding.base,
	},
	footer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
}));
