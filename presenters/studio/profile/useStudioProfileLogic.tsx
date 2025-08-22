import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';

import { SheetType } from 'sheets';
import { useAuth } from '@presenters/auth/AuthContext';
import useGetStudioTeam from '../../../network/useGetStudioTeam';
import useGetStudioFloors from '@network/useGetStudioFloors';

type TabType = 'Studio' | 'Team';
export interface Tab {
	id: number;
	title: TabType;
}
export interface TeamMember {
	id: number;
	first_name: string;
	last_name: string;
	role: string;
	profile_picture_url: string;
	studio: string;
}
export interface Studio {
	id: number;
	label: string;
}

const TABS: Tab[] = [
	{ id: 0, title: 'Studio' },
	{ id: 1, title: 'Team' },
];

export const useStudioProfileLogic = (activeTabFromParams?: TabType) => {
	const { studioId } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>(activeTabFromParams || 'Studio');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const navigation = useNavigation();

	const { data: studioFloorsData, isLoading: studioFloorsLoading } = useGetStudioFloors(studioId);
	const { data: teamData, isLoading: teamLoading } = useGetStudioTeam(studioId as string);

	const studioFloors = useMemo(() => {
		if (Array.isArray(studioFloorsData)) {
			return studioFloorsData.map(floor => ({
				id: floor[0],
				name: floor[1],
			}));
		}
		return [];
	}, [studioFloorsData]);

	const teamMembers = useMemo(() => {
		return teamData?.pages.flatMap(page => page.data) || [];
	}, [teamData]);

	useEffect(() => {
		if (activeTabFromParams) {
			setActiveTab(activeTabFromParams);
		}
	}, [activeTabFromParams]);

	const handleTabSwitch = useCallback((tab: TabType) => {
		setActiveTab(tab);
	}, []);

	const handleStudioCardPress = useCallback(
		(id: string) => {
			navigation.navigate('StudioDetails', { id });
		},
		[navigation],
	);

	const handleFooterButtonPress = useCallback(() => {
		if (activeTab === 'Studio') {
			SheetManager.show('Drawer', {
				payload: {
					sheet: SheetType.StudioRequest,
					data: {
						header: 'Raise a Request',
						text: 'If you wish to add a studio, please contact Talent Grid.',
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
		} else {
			navigation.navigate('StudioTeamMembers');
		}
	}, [activeTab, navigation]);

	const filteredTeamMembers = useMemo(() => teamMembers?.filter(member => member != null && (member.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || member.last_name?.toLowerCase().includes(searchQuery.toLowerCase()))) || [], [searchQuery, teamMembers]);

	const handleTeamMemberPress = useCallback((id: number, first_name: string, last_name: string, profile_picture_url: string) => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioTeamMemberManagement,
				data: {
					userId: id,
					isNewMember: false,
					userName: `${first_name} ${last_name}`,
					userRole: 'Team member role',
					profilePictureUrl: profile_picture_url,
				},
			},
		});
	}, []);

	return {
		TABS,
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		handleTabSwitch,
		handleStudioCardPress,
		handleFooterButtonPress,
		handleTeamMemberPress,
		filteredTeamMembers,
		teamLoading,
		studioFloors,
		studioFloorsLoading,
		isLoading: studioFloorsLoading || teamLoading,
	};
};
