import React, { useState } from 'react';
import { Button, Text } from '@touchblack/ui';
import { View, Dimensions } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ErrorFilled, Success } from '@touchblack/icons';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SheetManager } from 'react-native-actions-sheet';

const { width } = Dimensions.get('window');

interface IProps {
	data: {
		isSuccess: boolean;
		header: string;
		text: string;
		successText: string;
		dismissText: string;
		projectData?: {
			projectId: string;
			projectName: string;
			videoType: any;
		};
	};
}

const ProjectCreationPopup: React.FC<IProps> = ({ data }) => {
	const [isPopupVisible, setPopupVisible] = useState<boolean>(true);
	const navigation = useNavigation();
	const { styles, theme } = useStyles(stylesheet);

	const handlePrimaryAction = () => {
		SheetManager.hide('Drawer');

		if (data.isSuccess) {
			// Success case - Hire Talent
			setTimeout(() => {
				navigation.dispatch(StackActions.replace('CreateProjectStep2'));
			}, 100);
		} else {
			// Error case - Retry (just close the popup, user can try again)
			// The form is still there, so they can retry
		}
	};

	const handleSecondaryAction = () => {
		SheetManager.hide('Drawer');

		if (data.isSuccess) {
			// Success case - Hire Location
			setTimeout(() => {
				navigation.dispatch(StackActions.replace('StudioBookingStep1'));
			}, 100);
		} else {
			// Error case - Cancel (go back)
			setTimeout(() => {
				navigation.goBack();
			}, 100);
		}
	};

	if (!isPopupVisible) return null;

	return (
		<View style={styles.subscriptionPop}>
			<View style={styles.iconContainer}>{data.isSuccess ? <Success color={theme.colors.success} size={width / 6} /> : <ErrorFilled color={theme.colors.destructive} size={width / 6} />}</View>
			<View style={styles.contentContainer}>
				<Text color="regular" size="secondary" style={styles.regularFontFamily}>
					{data.header}
				</Text>
				<Text color="muted" size="bodyBig" style={styles.regularFontFamily}>
					{data.text}
				</Text>
			</View>
			<View style={styles.btnContainer}>
				<Button onPress={handleSecondaryAction} type="secondary" textColor="regular" style={styles.skipButton}>
					{data.dismissText}
				</Button>
				<Button onPress={handlePrimaryAction} type="primary" style={styles.subscribeButton}>
					{data.successText}
				</Button>
			</View>
		</View>
	);
};

export default ProjectCreationPopup;

const stylesheet = createStyleSheet(theme => ({
	subscriptionPop: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		width: width / 3,
		height: width / 3,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contentContainer: {
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		padding: theme.padding.lg,
		gap: theme.gap.sm,
		alignSelf: 'stretch',
	},
	regularFontFamily: {
		fontFamily: 'CabinetGrotesk-Regular',
		textAlign: 'center',
	},
	skipButton: {
		width: '50%',
	},
	subscribeButton: {
		width: '50%',
	},
	btnContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		padding: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
	},
	bannerText: {
		fontFamily: 'CabinetGrotesk-Regular',
		fontSize: theme.fontSize.primaryH3,
	},
}));
