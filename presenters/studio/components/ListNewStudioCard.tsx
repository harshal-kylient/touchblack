import { Pressable, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { LongArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';

import { SheetType } from 'sheets';

function ListNewStudioCard() {
	const { styles } = useStyles(stylesheet);

	const handlePress = () => {
		SheetManager.show('Drawer', {
			payload: {
				sheet: SheetType.StudioRequest,
				data: {
					header: 'Raise a Request',
					text: 'If you wish to add a studio, please contact Talent Grid.',
					onPress: () => {
						SheetManager.hide('Drawer');
					},
					onPressText: 'back',
				},
			},
		});
	};

	const steps = ['Sign in as a Studio owner and click on "List new Studio" from the home screen.', 'A request will be sent to the Talent Grid team.', 'Talent Grid will share a detailed studio spec form. Fill out the form and submit it.', "Once the details are received, it will be added into the app by the Talent Grid team and updated. The studio's profile will be available to manage the calendar, projects, payments, and more!"];

	return (
		<View>
			<View style={styles.contentContainer}>
				<View style={styles.header}>
					<Text size="secondary" color="regular" style={styles.headerText}>
						You're Almost There!
					</Text>
				</View>
				<View style={styles.body}>
					<Text size="bodyMid" color="regular" style={styles.bodyText}>
						You've successfully signed up as a Studio owner. To start managing your studio, the studio needs to be assigned to you. Once assigned, you'll be able to manage their calendar, bookings, payments, and mailbox.
					</Text>
					<Text size="bodyMid" color="regular" style={styles.bodyText}>
						Get a Studio Assigned:
					</Text>
					{steps.map((step, index) => (
						<Text key={index} size="bodyMid" color="regular" style={styles.bodyText}>
							{index + 1}. {step}
						</Text>
					))}
				</View>
			</View>

			<Pressable onPress={handlePress} style={styles.footer}>
				<Text size="bodyMid" color="primary" style={styles.footerText}>
					List new Studio
				</Text>
				<View style={styles.button}>
					<LongArrowRight size="24" color="black" />
				</View>
			</Pressable>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	contentContainer: {
		gap: theme.gap.base,
		paddingVertical: 40,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: theme.padding.base,
	},
	body: {
		paddingHorizontal: theme.padding.base,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingLeft: theme.padding.base,
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.slim,
	},
	button: {
		backgroundColor: theme.colors.primary,
		padding: theme.padding.base,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerText: {
		lineHeight: 28,
	},
	bodyText: {
		lineHeight: 22,
		marginTop: theme.margins.base,
	},
	footerText: {
		lineHeight: 20,
	},
}));

export default ListNewStudioCard;
