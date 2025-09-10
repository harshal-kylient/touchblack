import { SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';

function WelcomeManager({ route }) {
	const managerName = route.params?.managerName;
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation<TalentManager>();

	const handlePress = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'TabNavigator' }],
		});
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={styles.body}>
				<View style={styles.header}>
					<Text size="primarySm" color="regular">
						Hey, {managerName ? managerName : ''}
					</Text>
				</View>
				<View style={styles.gap}>
					<Text size="primaryMid" color="regular">
						You're Almost There!
					</Text>
					<Text size="bodyMid" color="muted" style={styles.paragraph1}>
						You’ve successfully signed up as a Manager. To start managing a talent’s profile, the talent needs to assign you as their manager. Once assigned, you'll be able to manage their calendar, projects, payments, and mailbox.
					</Text>
				</View>
				<View>
					<Text size="bodyMid" color="muted" style={styles.heading}>
						Getting Started as a Manager :
					</Text>
					<Text size="bodyMid" color="muted" style={styles.textStyle}>
						1. Ask the Talent you are managing to Log in and click on "Assign Manager" in home {'>'} profile (top right corner) {'>'} settings.
					</Text>
					<Text size="bodyMid" color="muted" style={styles.textStyle}>
						2. Ask the talent to select your name from the manager list.
					</Text>
					<Text size="bodyMid" color="muted" style={styles.textStyle}>
						3. You will receive an OTP. Enter it on the talent's screen to confirm.
					</Text>
					<Text size="bodyMid" color="muted" style={styles.textStyle}>
						4. Once completed, the talent's profile will be available for you to manage. Start managing their calendar, projects, payments, and more!
					</Text>
				</View>
			</View>
			<View style={styles.footer}>
				<Button type="primary" style={styles.button} onPress={handlePress}>
					Let's go!
				</Button>
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {
		borderColor: theme.colors.borderGray,
		paddingVertical: theme.padding.sm,
		borderBottomWidth: theme.borderWidth.slim,
	},
	heading: {
		paddingTop: theme.padding.base,
		lineHeight: 18,
	},
	textStyle: {
		paddingVertical: theme.padding.xs,
		lineHeight: 20,
	},
	body: {
		flex: 1,

		paddingHorizontal: theme.padding.base,
		paddingRight: theme.padding.base * 2,
	},
	paragraph1: {
		lineHeight: 22.5,
	},
	footer: {
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: {
		flex: 1,
	},
	gap: {
		gap: theme.gap.base,
		paddingTop: theme.padding.base,
	},
}));

export default WelcomeManager;
