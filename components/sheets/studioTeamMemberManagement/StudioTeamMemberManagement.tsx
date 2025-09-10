import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import HeaderPlaceholder from '@components/loaders/HeaderPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';

import { FooterButtons } from './FooterButtons';
import { TeamMemberHeader } from './TeamMemberHeader';
import { StudioPermissionsHeader } from './StudioPermissionsHeader';
import { RemoveFromTeamButton } from './RemoveFromTeamButton';
import { useStudioTeamMemberManagement } from './useStudioTeamMemberManagement';
import { PermissionsList } from './PermissionsList';

interface StudioTeamMemberManagementProps {
	userId: string;
	isNewMember: boolean;
	userName?: string;
	userRole?: string;
	profilePictureUrl?: string;
}

function StudioTeamMemberManagement({ userId, isNewMember, userName = 'Team member name', userRole = 'Team member role', profilePictureUrl }: StudioTeamMemberManagementProps) {
	const { styles } = useStyles(stylesheet);
	const { control, error, handleClose, handleSubmit, handleRemoveMember, isLoading, onSubmit } = useStudioTeamMemberManagement(userId, isNewMember);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<View style={[styles.accordionContent, { paddingBottom: 20 }]}>
					<HeaderPlaceholder />
					<TextWithIconPlaceholder />
					<TextPlaceholder customWidth={'100%'} customHeight={40} />
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.accordionContent}>
				{!isNewMember && <TeamMemberHeader userName={userName} userRole={userRole} profilePictureUrl={profilePictureUrl} />}
				{!isNewMember && <RemoveFromTeamButton onPress={handleRemoveMember} />}
				<StudioPermissionsHeader />
				<PermissionsList control={control} />
				{error && (
					<Text size="bodySm" color="error" style={styles.errorText}>
						{error}
					</Text>
				)}
				<FooterButtons handleClose={handleClose} handleSubmit={handleSubmit} onSubmit={onSubmit} isNewMember={isNewMember} isSubmitting={isLoading} />
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundLightBlack,
	},
	accordionContent: {
		flexDirection: 'column',
		paddingTop: theme.padding.none,
	},

	errorText: {
		margin: theme.margins.base,
		marginBottom: theme.margins.base,
	},
}));

export default StudioTeamMemberManagement;
