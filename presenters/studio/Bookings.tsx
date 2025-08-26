import React, { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, View } from 'react-native';
import { Button } from '@touchblack/ui';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Calendar, List } from '@touchblack/icons';
import StudioTitle from './components/StudioTitle';
import { ViewType } from '@presenters/projects/ProjectContext';
import { useNavigation } from '@react-navigation/native';
import StudioProjectsItem from './StudioProjectItem';
import EnumStudioStatus from '@models/enums/EnumStudioStatus';
import StudioCalendarView from './StudioCalendarView';

const Bookings = () => {
	const { styles, theme } = useStyles(stylesheet);
	const [isStudioTitleOpen, setIsStudioTitleOpen] = useState(false);
	const [activeView, setActiveView] = useState(ViewType.LIST);
	const navigation = useNavigation();

	const handleOutsidePress = useCallback(() => {
		if (isStudioTitleOpen) {
			setIsStudioTitleOpen(false);
		}
	}, [isStudioTitleOpen]);

	const handleViewChange = useCallback((viewType: ViewType) => {
		setActiveView(viewType);
	}, []);

	const handleSelfBlockNavigation = useCallback(() => {
		navigation.navigate('SelfBlock');
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<View style={styles.header}>
				<View style={styles.studioTitleContainer}>
					{<StudioTitle isOpen={isStudioTitleOpen} setIsOpen={setIsStudioTitleOpen} textStyle={styles.studioTitleText} />}
					{/*<Text color="regular" size="primaryMid" style={{ fontFamily: theme.fontFamily.cgBold }}>
						Bookings
					</Text>*/}
				</View>
				<View style={styles.controlsContainer}>
					<Pressable onPress={() => handleViewChange(ViewType.GRID)} style={styles.iconButton}>
						<Calendar color="none" size="20" strokeWidth={3} strokeColor={activeView === ViewType.GRID ? theme.colors.typography : theme.colors.muted} />
					</Pressable>
					<Pressable onPress={() => handleViewChange(ViewType.LIST)} style={styles.iconButton}>
						<List size="24" color={activeView === ViewType.LIST ? theme.colors.typography : theme.colors.muted} />
					</Pressable>
					<Button onPress={handleSelfBlockNavigation} type="inline" textColor={'primary'} style={styles.selfBlockButton}>
						Self Block
					</Button>
				</View>
			</View>
			{activeView === ViewType.LIST ? (
				<ScrollView style={{ flex: 1, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }}>
					<StudioProjectsItem title="Enquiries" color={theme.colors.success} status={EnumStudioStatus.Enquiry} />
					<StudioProjectsItem title="Tentative Bookings" color={theme.colors.primary} status={EnumStudioStatus.Tentative} />
					<StudioProjectsItem title="Confirmed Bookings" color={'#F56446'} status={EnumStudioStatus.Confirmed} />
					<StudioProjectsItem title="Completed Bookings" color={'#555'} status={EnumStudioStatus.Completed} />
					<StudioProjectsItem title="Cancelled Bookings" color={'#555'} status={EnumStudioStatus.Cancelled} />
					<StudioProjectsItem title="Opted Out" color={'#555'} status={EnumStudioStatus['Not available']} />
				</ScrollView>
			) : (
				<StudioCalendarView />
			)}
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		zIndex: 1,
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	header: {
		zIndex: 99999,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: theme.padding.base,
		width: '100%',
		paddingBottom: theme.padding.base,
	},
	studioTitleContainer: {
		zIndex: 99999,
		flexGrow: 1,
		maxWidth: '40%',
	},
	studioTitleText: {
		fontSize: 24,
		flexGrow: 1,
	},
	controlsContainer: {
		flexDirection: 'row',
		gap: theme.gap.xxs,
		alignItems: 'center',
		flexShrink: 0,
	},
	iconButton: {
		padding: theme.padding.xxs,
	},
	selfBlockButton: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.xxs,
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));

export default React.memo(Bookings);
