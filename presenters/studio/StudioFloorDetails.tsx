import { useCallback, useState, useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Calendar } from '@touchblack/icons';
import { Button } from '@touchblack/ui';

import Header from '@components/Header';
import { StudioProfileCard } from './components/StudioProfileCard';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';
import useGetStudioFloorDetails from '@network/useGetStudioFloorDetails';
import HeaderPlaceholder from '@components/loaders/HeaderPlaceholder';
import ProfilePlaceholder from '@components/loaders/ProfilePlaceholder';
import TabsPlaceholder from '@components/loaders/TabsPlaceholder';
import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';
import { useStudioBookingContext } from './booking/StudioContext';
import { useAuth } from '@presenters/auth/AuthContext';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';

export type TabType = 'Details' | 'Amenities' | 'Photos' | 'Pricing List';

export const TABS: { id: number; title: TabType }[] = [
	{ id: 0, title: 'Details' },
	{ id: 1, title: 'Amenities' },
	{ id: 2, title: 'Photos' },
	{ id: 3, title: 'Pricing List' },
];

const StudioFloorDetails = ({ route }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { loginType, permissions } = useAuth();
	const { id } = route.params as { id: string };
	const shortlist = route.params?.shortlist;
	const studio = route.params?.studio;
	const tab = route.params?.tab;
	const [activeTab, setActiveTab] = useState<TabType>('Details');
	const { data: response, isLoading } = useGetStudioFloorDetails(id);
	const navigation = useNavigation();
	const { state, dispatch } = useStudioBookingContext();

	const floorDetails = useMemo(() => response?.data?.data, [response]);

	const handleCalendarPress = useCallback(() => {
		navigation.navigate('OtherStudioCalendarView', { id, shortlist, floorDetails });
	}, [id, navigation, shortlist, floorDetails]);

	const handleEditStudio = useCallback(() => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioRequest,
				data: {
					header: 'Edit Request',
					text: 'If you wish to edit the information, please contact Talent Grid.',
					onPress: () => {
						SheetManager.hide('Drawer', {
							payload: {
								sheet: SheetType.StudioRequest,
							},
						});
					},
				},
			},
		});
	}, []);

	const handleShortlist = useCallback(() => {
		dispatch({ type: 'ADD_STUDIO_FLOOR', value: floorDetails });
		if (!state.project_id?.id) {
			navigation.navigate('StudioBookingStep1', { direct_studio_booking: true, studio_selected_flow: true });
			return;
		}
		navigation.navigate('StudioBookingStep2');
	}, [dispatch, navigation, floorDetails]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.container}>
				<HeaderPlaceholder />
				<ProfilePlaceholder />
				<TabsPlaceholder numberOfTabs={2} />
				<TextWithIconPlaceholder />
				<TextWithIconPlaceholder />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />
			<Header style={styles.header} name={floorDetails?.name}>
				<View style={{ flex: 1, gap: theme.gap.base, maxWidth: '15%', justifyContent: 'flex-end', flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
					<Pressable onPress={() => navigation.navigate('OtherStudioCalendarView', { id, shortlist, floorDetails, name: floorDetails?.name })}>
						<Calendar color="none" size="22" strokeWidth={3} strokeColor={theme.colors.typography} />
					</Pressable>
					{floorDetails?.profile_picture_url ? <Image style={{ width: 30, height: 30, borderWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray }} source={{ uri: createAbsoluteImageUri(floorDetails?.profile_picture_url || '') }} /> : null}
				</View>
			</Header>
			<ScrollView bounces={false} contentContainerStyle={styles.scrollContainer}>
				<StudioProfileCard floorDetails={floorDetails} />
				<TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
				<TabContent floorId={id} activeTab={activeTab} floorDetails={floorDetails} />
			</ScrollView>
			<View style={styles.footer}>
				{shortlist ? (
					<Button type="inline" textColor={permissions?.includes('Project::Edit') ? 'primary' : 'muted'} style={styles.button(!permissions?.includes('Project::Edit'))} isDisabled={!permissions?.includes('Project::Edit')} onPress={handleShortlist}>
						ShortList
					</Button>
				) : loginType === 'studio' ? (
					<Button type="inline" textColor="primary" style={styles.button(false)} onPress={handleEditStudio}>
						Edit
					</Button>
				) : null}
			</View>
		</SafeAreaView>
	);
};

const stylesheet = createStyleSheet(theme => ({
	container: {
		flex: 1,
		backgroundColor: theme.colors.backgroundDarkBlack,
	},
	scrollContainer: {
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'space-between',
	},
	header: {
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	footer: {
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	button: (isDisabled: boolean = false) => ({
		width: '100%',
		borderWidth: theme.borderWidth.slim,
		borderColor: isDisabled ? theme.colors.muted : theme.colors.primary,
	}),
}));

export default StudioFloorDetails;
