import LabelWithTouchableIcon from '@components/LabelWithTouchableIcon';
import { useNavigation } from '@react-navigation/native';

import useGetProducerProjects from '@network/useGetProducerProjects';
import EnumProducerStatus from '@models/enums/EnumProducerStatus';
import ScrollableHorizontalGrid from '@components/ScrollableHorizontalGrid';

import { Button, Text } from '@touchblack/ui';
import { LongArrowRight } from '@touchblack/icons';
import { HomeProjectsNoAccess } from '@assets/svgs/errors';
import LiveProjectCard from '@presenters/LiveProjectCard';
import { Pressable, View } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { useAuth } from '@presenters/auth/AuthContext';
import CONSTANTS from '@constants/constants';

export default function HomeProjects() {
	const navigation = useNavigation();
	const { theme } = useStyles();
	const { permissions } = useAuth();

	const { data: liveProjects } = useGetProducerProjects(EnumProducerStatus.Live, true);

	const handleCreateProjectNavigation = () => {
		navigation.navigate('CreateProjectStep1');
	};

	const hasProjectViewPermission = permissions?.includes('Project::View');

	const renderContent = () => {
		if (hasProjectViewPermission) {
			if (liveProjects?.length) {
				return (
					<>
						<ScrollableHorizontalGrid>
							{liveProjects?.slice(0, 3)?.map((it, index) => (
								<LiveProjectCard index={index} project={it} />
							))}
						</ScrollableHorizontalGrid>
						<View style={{ borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xs }}>
							<Button onPress={handleCreateProjectNavigation} textColor="primary" type="secondary" style={{ flexGrow: 1, marginHorizontal: theme.margins.sm, borderColor: theme.colors.primary, borderWidth: theme.borderWidth.slim }}>
								Create new project +
							</Button>
						</View>
					</>
				);
			} else
				return (
					<View style={{ borderTopWidth: theme.borderWidth.slim, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingHorizontal: theme.padding.base }}>
						<View style={{ borderLeftWidth: theme.borderWidth.slim, borderRightWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, backgroundColor: theme.colors.backgroundLightBlack }}>
							<View style={{ gap: theme.gap.xs, borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingVertical: theme.padding.xl, paddingHorizontal: theme.padding.xs }}>
								<Text size="primaryMid" color="regular">
									Launch a Project
								</Text>
								<Text size="bodyMid" color="regular">
									Create a new project and invite your dream team.
								</Text>
							</View>
							<View style={{ flexDirection: 'row', paddingLeft: theme.padding.base, justifyContent: 'space-between', alignItems: 'center' }}>
								<Text size="bodyMid" color="primary">
									Add New Project
								</Text>
								<Pressable onPress={handleCreateProjectNavigation} style={{ justifyContent: 'center', alignItems: 'center', padding: theme.padding.xs, backgroundColor: theme.colors.primary }}>
									<LongArrowRight size="24" color={theme.colors.black} />
								</Pressable>
							</View>
						</View>
					</View>
				);
		} else
			return (
				<View style={{ flex: 1, borderBottomWidth: theme.borderWidth.slim, borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, paddingTop: theme.padding.xxxl, paddingBottom: theme.padding.xs, width: CONSTANTS.screenWidth, alignItems: 'center' }}>
					<HomeProjectsNoAccess />
					<Text size="primaryMid" color="regular">
						No access to projects !
					</Text>
				</View>
			);
	};

	return (
		<>
			<LabelWithTouchableIcon onPress={() => navigation.navigate('LiveProjects', { screen: true })} label="Live Projects" style={{ marginTop: theme.margins.base, marginBottom: theme.margins.base }} isHidden={!hasProjectViewPermission} />
			{renderContent()}
		</>
	);
}
