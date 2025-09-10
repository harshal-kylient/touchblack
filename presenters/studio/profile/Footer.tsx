import React from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button } from '@touchblack/ui';
import { useAuth } from '@presenters/auth/AuthContext';

interface FooterProps {
	onPress: () => void;
	activeTab: string;
}

const Footer: React.FC<FooterProps> = ({ onPress, activeTab }) => {
	const { styles } = useStyles(stylesheet);
	const { userId, studioOwnerId } = useAuth();
	const notStudioOwner = userId !== studioOwnerId;

	return (
		<View style={styles.footer}>
			<Button style={styles.button(notStudioOwner)} isDisabled={notStudioOwner} onPress={onPress}>
				{activeTab === 'Studio' ? 'Add Studio Floor' : 'Add Team Member'}
			</Button>
		</View>
	);
};

const stylesheet = createStyleSheet(theme => ({
	footer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: theme.margins.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	button: (notStudioOwner: boolean) => ({
		backgroundColor: notStudioOwner ? theme.colors.muted : theme.colors.primary,
		color: notStudioOwner ? theme.colors.borderGray : theme.colors.typography,
		opacity: notStudioOwner ? 0.4 : 1,
	}),
}));

export default Footer;
