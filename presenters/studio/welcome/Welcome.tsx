import { SafeAreaView, StatusBar, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button, Text } from '@touchblack/ui';

import Header from '@components/Header';
import useWelcomeLogic from './useWelcomeLogic';

function Welcome() {
	const { styles, theme } = useStyles(stylesheet);
	const { studioName, handleButtonPress } = useWelcomeLogic();

	return (
		<SafeAreaView style={styles.container}>
			<Header name="Studio Owner" />
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={styles.body}>
				<View style={styles.gap}>
					<Text size="primaryBig" color="regular">
						Welcome to Talent Grid's Studio Platform.
					</Text>
					<Text size="primarySm" color="muted">
						We are happy to have you here. Now, you are all set to take the bookings for {studioName}. We will help you to build your business.
					</Text>
				</View>
				<Text size="primarySm" color="muted">
					Tip: Update your studio calendar regularly and increase the chances of getting more bookings.
				</Text>
			</View>
			<View style={styles.footer}>
				<Button type="primary" style={styles.button} onPress={handleButtonPress}>
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
		gap: 60,
	},
	body: {
		flex: 1,
		gap: 60,
		paddingHorizontal: theme.padding.base,
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
	},
}));

export default Welcome;
