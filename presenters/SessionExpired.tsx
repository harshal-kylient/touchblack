import { SafeAreaView, View } from 'react-native';
import { SessionExpired as SessionExpiredSvg } from '@assets/svgs/errors';
import { Button } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import { useNavigation } from '@react-navigation/native';

export default function SessionExpired() {
	const navigation = useNavigation();

	function handleSigninAgain() {
		navigation.reset({
			index: 0,
			routes: [{ name: 'Login' }],
		});
	}

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: darkTheme.colors.backgroundDarkBlack }}>
			<SessionExpiredSvg />
			<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 2 * 16, paddingTop: 16, borderTopWidth: 1, borderColor: 'gray' }}>
				<Button onPress={handleSigninAgain}>Signin Again</Button>
			</View>
		</SafeAreaView>
	);
}
