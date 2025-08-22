import UserItem from '@components/UserItem';
import useGetUserDetailsById from '@network/useGetUserDetailsById';
import { Bookmark } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import createAbsoluteImageUri from '@utils/createAbsoluteImageUri';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { RemoveFromTeamButton } from './RemoveFromTeamButton';

export const ProducerPermissionsHeader = ({ userId, handleRemoveMember, isNewMember }) => {
	const { styles, theme } = useStyles(stylesheet);
	const { data } = useGetUserDetailsById('User', userId);

	return (
		<>
			<UserItem
				id={userId}
				style={{ backgroundColor: theme.colors.backgroundLightBlack, marginBottom: theme.margins.xs }}
				name={(data?.first_name || '') + ' ' + (data?.last_name || '')}
				profession={data?.talent_role}
				image={createAbsoluteImageUri(data?.profile_picture_url)}
				city={data?.city}
				cta={<View style={{ flex: 1 }}>{data?.is_bookmarked ? <Bookmark size="24" color={theme.colors.primary} strokeColor={theme.colors.primary} strokeWidth={2} /> : <Bookmark size="24" color="none" strokeColor={theme.colors.typography} strokeWidth={2} />}</View>}
			/>
			{!isNewMember && <RemoveFromTeamButton onPress={handleRemoveMember} />}
			<View style={{ flexDirection: 'row', paddingVertical: theme.padding.xs, alignItems: 'center', paddingHorizontal: theme.padding.base, minWidth: '100%', justifyContent: 'space-between' }}>
				<Text color="regular" size="primaryMid">
					Access
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
		</>
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
	},
	talentName: {
		maxWidth: '50%',
	},
	permissionHeaders: {
		justifyContent: 'flex-end',
		paddingHorizontal: theme.padding.xxs,
		flexDirection: 'row',
		gap: 16,
	},
	permissionHeader: {
		paddingHorizontal: 16,
	},
}));
