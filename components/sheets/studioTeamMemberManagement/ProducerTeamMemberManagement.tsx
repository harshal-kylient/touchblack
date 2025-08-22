import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';

import TextWithIconPlaceholder from '@components/loaders/TextWithIconPlaceholder';
import HeaderPlaceholder from '@components/loaders/HeaderPlaceholder';
import TextPlaceholder from '@components/loaders/TextPlaceholder';

import { FooterButtons } from './FooterButtons';
import { useProducerTeamMemberManagement } from './useProducerTeamMemberManagement';
import { ProducerPermissionsList } from './ProducerPermissionsList';
import { ProducerPermissionsHeader } from './ProducerPermissionsHeader';

interface ProducerTeamMemberManagementProps {
	userId: string;
}

function ProducerTeamMemberManagement({ userId }: ProducerTeamMemberManagementProps) {
	const { styles } = useStyles(stylesheet);
	const { getValues, setValue, control, error, isNewMember, handleClose, permissions, handleSubmit, handleRemoveMember, isLoading, onSubmit } = useProducerTeamMemberManagement(userId);

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
				<ProducerPermissionsHeader userId={userId} isNewMember={isNewMember} handleRemoveMember={handleRemoveMember} />
				<ProducerPermissionsList permissions={permissions} setValue={setValue} getValues={getValues} control={control} />
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

export default ProducerTeamMemberManagement;
