import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { Archive } from '@touchblack/icons';

const ToggleArchiveButton = ({ isCurrentlyArchived }: { isCurrentlyArchived: boolean }) => {
	const { styles, theme } = useStyles(stylesheet);

	return (
		<View style={styles.buttonElement(isCurrentlyArchived)}>
			<Archive size="24" strokeColor={theme.colors.black} color={theme.colors.black} />
			<Text size="cardSubHeading" color="black">
				{isCurrentlyArchived ? 'Unarchive' : 'Archive'}
			</Text>
		</View>
	);
};

export default ToggleArchiveButton;

const stylesheet = createStyleSheet(theme => ({
	buttonElement: (isCurrentlyArchived: boolean) => ({
		backgroundColor: isCurrentlyArchived ? theme.colors.success : theme.colors.destructive,
		width: 64,
		height: 64,
		justifyContent: 'center',
		alignItems: 'center',
	}),
}));
