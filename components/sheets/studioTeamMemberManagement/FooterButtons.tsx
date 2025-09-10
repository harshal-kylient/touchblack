import { Button } from '@touchblack/ui';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const FooterButtons = ({ handleClose, handleSubmit, onSubmit, isNewMember, isSubmitting }) => {
	const { styles } = useStyles(stylesheet);
	return (
		<View style={styles.buttonFooter}>
			<Button onPress={handleClose} type="secondary" textColor="regular" style={[styles.button, styles.cancelButton]}>
				Cancel
			</Button>
			<Button onPress={handleSubmit(onSubmit)} type="primary" style={styles.button} isDisabled={isSubmitting}>
				{isSubmitting ? 'Saving...' : isNewMember ? 'Add' : 'Save'}
			</Button>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	buttonFooter: {
		flexDirection: 'row',
		padding: theme.padding.base,
		justifyContent: 'center',
		alignItems: 'center',
	},
	button: {
		flexGrow: 1,
		width: '50%',
	},
	cancelButton: {
		borderWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
}));
