import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';

import { Calendar, List } from '@touchblack/icons';
import { Button } from '@touchblack/ui';

import { useProjects } from './ProjectContext';
import { useAuth } from '@presenters/auth/AuthContext';
import capitalized from '@utils/capitalized';

const ProjectHeaderButtons = memo(() => {
	const { styles, theme } = useStyles(stylesheet);
	const { projectView, setProjectView } = useProjects();
	const { loginType } = useAuth();
	const userType = capitalized(loginType! === 'talent' ? 'User' : loginType!);
	const navigation = useNavigation();

	const handleBlackoutDates = useCallback(() => {
		navigation.navigate('BlackoutDates');
	}, [navigation]);

	return (
		<View style={styles.container}>
			{/* This button is hidden and only to balance the layout (calendar height) ===> see projectHeaderHeight in userProjectCalendarLogic */}
			{userType === 'Producer' && (
				<Button type="secondary" isDisabled={true} onPress={() => {}} style={[styles.blackoutButton, { opacity: 0 }]}>
					Blackout
				</Button>
			)}
			<Pressable onPress={() => setProjectView('calendar')}>
				<Calendar color="none" size="20" strokeWidth={3} strokeColor={projectView === 'calendar' ? theme.colors.typography : theme.colors.muted} />
			</Pressable>
			<Pressable onPress={() => setProjectView('list')}>
				<List size="24" color={projectView === 'list' ? theme.colors.typography : theme.colors.muted} />
			</Pressable>
			{userType === 'User' && (
				<Button type="secondary" textColor="primary" style={styles.blackoutButton} onPress={handleBlackoutDates}>
					Blackout
				</Button>
			)}
		</View>
	);
});

export default ProjectHeaderButtons;

const stylesheet = createStyleSheet(theme => ({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: theme.gap.base,
	},
	blackoutButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		fontFamily: theme.fontFamily.cgThin,
		paddingHorizontal: theme.padding.xxs,
		paddingVertical: theme.padding.xxs,
	},
}));
