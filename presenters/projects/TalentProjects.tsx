import { SafeAreaView, ScrollView, View, Text, Pressable, StatusBar } from 'react-native';
import { darkTheme } from '@touchblack/ui/theme';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Calendar, List } from '@touchblack/icons';
import { ViewType, useProjectsContext } from './ProjectContext';
import EnumStatus from '@models/enums/EnumStatus';
import TalentProjectsItem from './TalentProjectsItem';
import { Text as UIText } from '@touchblack/ui';
import { useNavigation } from '@react-navigation/native';
import TalentCalendarView from './TalentCalendarView';
import ManagerTalentDropdown from '@presenters/assignManager/ManagerTalentDropdown';
import { useAuth } from '@presenters/auth/AuthContext';
import { useGetManagerStatus } from '@network/useGetManagerStatus';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TalentProjects({ route }) {
	const { theme, styles } = useStyles(stylesheet);
	const { loginType } = useAuth();
	const { data: managerStatus } = useGetManagerStatus();
	const managerId = managerStatus?.data?.manager_talent;
	const { dispatch, state } = useProjectsContext();
	const activeView = state.active_view;
	const navigation = useNavigation();
	const paramOpenStatus = route.params?.openStatus || null;
	const statusMap = {
		Enquiry: EnumStatus.Enquiry,
		Tentative: EnumStatus.Tentative,
		Confirmed: EnumStatus.Confirmed,
		Opted_out: EnumStatus.Opted_out,
	};

	const openEnumStatus = statusMap[paramOpenStatus] || null;

	const handleViewChange = (viewType: ViewType) => {
		dispatch({ type: 'ACTIVE_VIEW', value: viewType });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: darkTheme.colors.backgroundDarkBlack ,paddingTop: Platform.OS === "android" ? theme.padding.base:0 }}>
			<StatusBar barStyle="light-content" backgroundColor={theme.colors.backgroundDarkBlack} />

			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingHorizontal: theme.padding.base,
					paddingBottom: theme.padding.base,
					zIndex: 2,
				}}>
				{loginType === 'manager' ? (
					<View style={{ zIndex: 9999, flex: 1 }}>
						<ManagerTalentDropdown charecterLength={12} />
					</View>
				) : (
					<Text
						style={{
							fontFamily: theme.fontFamily.cgMedium,
							fontSize: theme.fontSize.primaryH2,
							color: theme.colors.typography,
						}}>
						Projects
					</Text>
				)}

				<View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.gap.base*2, marginRight:theme.margins.sm }}>
					<Pressable onPress={() => handleViewChange(ViewType.GRID)}>
						<Calendar color="none" size="20" strokeWidth={3} strokeColor={activeView === ViewType.GRID ? theme.colors.primary : theme.colors.typography} />
					</Pressable>
					<Pressable onPress={() => handleViewChange(ViewType.LIST)}>
						<List size="24" color={activeView === ViewType.LIST ? theme.colors.primary : theme.colors.typography} />
					</Pressable>
				</View>
			</View>
			{activeView === ViewType.LIST ? (
				<ScrollView style={{ flex: 1 }}>
					<View>
						{loginType === 'talent' && managerId && (
							<View style={styles.managerAlert}>
								<Text style={styles.warningText}>* </Text>
								<Text style={styles.warningText}>Project Chats, Now Handled by Your Manager</Text>
							</View>
						)}
					</View>
					<TalentProjectsItem title="Enquiries" color={theme.colors.success} status={EnumStatus.Enquiry} isOpen={openEnumStatus === EnumStatus.Enquiry} />
					<TalentProjectsItem title="Tentative Projects" color={theme.colors.primary} status={EnumStatus.Tentative} isOpen={openEnumStatus === EnumStatus.Tentative} />
					<TalentProjectsItem title="Confirmed Projects" color={'#F56446'} status={EnumStatus.Confirmed} isOpen={openEnumStatus === EnumStatus.Confirmed} />
					<TalentProjectsItem title="Opted Out Projects" color={'#555'} status={EnumStatus.Opted_out} isOpen={openEnumStatus === EnumStatus.Opted_out} />
				</ScrollView>
			) : (
				<TalentCalendarView />
			)}
		</SafeAreaView>
	);
}

const stylesheet = createStyleSheet(theme => ({
	dropDownContainer: { zIndex: 9999, position: 'relative', backgroundColor: darkTheme.colors.black },
	managerAlert: {
		padding: theme.padding.xxs,
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: theme.padding.sm,
	},
	warningText: {
		color: theme.colors.muted,
		fontFamily: theme.fontFamily.cgMedium,
		fontSize: theme.fontSize.typographySm,
	},
}));
