import { useAuth } from '@presenters/auth/AuthContext';
import { Text } from '@touchblack/ui';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const StudioPermissionsHeader = () => {
	const { styles } = useStyles(stylesheet);
	const { studioName } = useAuth();

	return (
		<View style={styles.talentCard}>
			<Text size="primaryMid" color="regular" numberOfLines={1} style={styles.talentName}>
				{studioName}
			</Text>
			<View style={styles.permissionHeaders}>
				<Text size="primarySm" color="regular" style={styles.permissionHeader}>
					View
				</Text>
				<Text size="primarySm" color="regular" style={styles.permissionHeader}>
					Edit
				</Text>
			</View>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	talentCard: {
		flexDirection: 'row',
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.padding.base,
	},
	talentName: {
		maxWidth: '50%',
	},
	permissionHeaders: {
		flexDirection: 'row',
		gap: 16,
	},
	permissionHeader: {
		paddingHorizontal: 16,
	},
}));
