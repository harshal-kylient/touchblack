import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';

interface ProfileNoteProps {
	notes: string;
}

const ProfileNote = ({ notes }: ProfileNoteProps) => {
	const { styles } = useStyles(stylesheet);

	return (
		<View style={styles.blackBookProfileHeaderNoteContainer}>
			<View style={styles.separatorView} />
			<View style={styles.blackBookProfileHeaderNoteTitle}>
				<Text size="bodyBig" color="regular">
					Note
				</Text>
			</View>
			<View style={styles.blackBookProfileHeaderNote}>
				<Text size="bodyBig" color="regular">
					{notes || '-'}
				</Text>
			</View>
		</View>
	);
};

export default ProfileNote;

const stylesheet = createStyleSheet(theme => ({
	blackBookProfileHeaderNoteContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.backgroundDarkBlack,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.muted,
	},
	blackBookProfileHeaderNoteTitle: {
		width: 88,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.padding.base,
	},
	blackBookProfileHeaderNote: {
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		padding: theme.padding.base,
		flex: 1,
		backgroundColor: theme.colors.black,
	},
	separatorView: {
		width: 16,
	},
}));
