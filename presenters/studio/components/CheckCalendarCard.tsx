import { Calendar, LongArrowRight } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function CheckCalendarCard() {
	const { styles } = useStyles(stylesheet);

	const handlePress = () => {
		// TODO: navigate to calendar
	};

	return (
		<Pressable onPress={handlePress} style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.header}>
					<Text size="secondary" color="regular" style={{ lineHeight: 28 }}>
						Check Calendar
					</Text>
					<Calendar color="transparent" strokeColor="white" strokeWidth={3} size="20" />
				</View>
				<View style={styles.body}>
					<Text size="bodyMid" color="regular" style={{ lineHeight: 22 }}>
						Take a glance on Calendar for recent Enquiries.
					</Text>
				</View>
				<View style={styles.footer}>
					<Text size="bodyMid" color="primary" style={{ lineHeight: 20 }}>
						Check now
					</Text>
					<View style={styles.button}>
						<LongArrowRight size="24" color="black" />
					</View>
				</View>
			</View>
		</Pressable>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: {
		borderTopWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderBottomWidth: theme.borderWidth.bold,
	},
	contentContainer: {
		borderLeftWidth: theme.borderWidth.slim,
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.slim,
		backgroundColor: theme.colors.backgroundLightBlack,
		marginHorizontal: theme.margins.base,
		gap: theme.gap.base,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
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
	},
	button: {
		backgroundColor: theme.colors.primary,
		padding: theme.padding.base,
		width: 40,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

export default CheckCalendarCard;
