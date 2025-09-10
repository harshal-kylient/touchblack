import { View, Platform, SafeAreaView, StatusBar } from 'react-native';

import { darkTheme } from '@touchblack/ui/theme';

import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ConversationsList from './ConversationsList';
import StudioTitle from '../components/StudioTitle';
import { useState } from 'react';

export default function StudioConversationsList() {
	const { styles, theme } = useStyles(stylesheet);
	const [isStudioTitleOpen, setIsStudioTitleOpen] = useState(false);

	return (
		<SafeAreaView style={{ flex: 1, zIndex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 0, backgroundColor: darkTheme.colors.black }}>
			<StatusBar backgroundColor={theme.colors.black} />
			<View style={{ flex: 1, backgroundColor: darkTheme.colors.black }}>
				<View style={{ flexDirection: 'row', backgroundColor: theme.colors.black, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, justifyContent: 'space-between', paddingHorizontal: darkTheme.padding.base, paddingBottom: darkTheme.padding.sm }}>
					<View style={styles.studioTitleContainer}>{<StudioTitle isOpen={isStudioTitleOpen} setIsOpen={setIsStudioTitleOpen} textStyle={styles.studioTitleText} />}</View>
				</View>
				<ConversationsList />
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	studioTitleContainer: {
		zIndex: 9999,
		flexGrow: 1,
		maxWidth: '40%',
	},
	studioTitleText: {
		fontSize: 24,
		flexGrow: 1,
	},
}));
