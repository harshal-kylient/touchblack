import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { View } from 'react-native';

function MessageProfile() {
	const { styles, theme } = useStyles(stylesheet);
	return <View></View>;
}

const stylesheet = createStyleSheet(theme => ({}));

export default MessageProfile;
