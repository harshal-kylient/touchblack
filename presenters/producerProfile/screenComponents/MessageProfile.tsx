import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const stylesheet = createStyleSheet(theme => ({}));

function MessageProfile() {
	const { styles, theme } = useStyles(stylesheet);
	return <View></View>;
}

export default MessageProfile;
