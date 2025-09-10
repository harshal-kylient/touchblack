import { View, Platform, SafeAreaView, StatusBar } from 'react-native';
import { darkTheme } from '@touchblack/ui/theme';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import ProjectsList from '@presenters/messages/project-chats/ProjectsList';
import ManagerTalentDropdown from './ManagerTalentDropdown';

export default function ManagerChats() {
	const { styles, theme } = useStyles(stylesheet);
	return (
		<SafeAreaView style={styles.mainContainer}>
			<StatusBar barStyle={'light-content'} backgroundColor={theme.colors.backgroundLightBlack} />
			<View style={styles.subMainContainer}>
				<View style={styles.subContainer}>
					<ManagerTalentDropdown charecterLength={25} />
				</View>
				<ProjectsList />
			</View>
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	absoluteContainer: (active: boolean) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -1,
		height: 2,
		zIndex: 99,
		backgroundColor: active ? theme.colors.black : theme.colors.transparent,
	}),
	subContainer: { zIndex: 10, position: 'relative', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, backgroundColor: darkTheme.colors.backgroundDarkBlack, paddingHorizontal: theme.padding.base, width: '100%', paddingVertical: theme.padding.sm },
	mainContainer: { flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack },
	subMainContainer: { flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack },
}));
