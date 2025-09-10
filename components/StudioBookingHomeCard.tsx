import { useNavigation } from '@react-navigation/native';
import { LongArrowRight, Calendar } from '@touchblack/icons';
import { Text } from '@touchblack/ui';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export default function StudioBookingHomeCard() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	function handleStudioBookingNavigation() {
		navigation.navigate('StudioBookingStep1', { direct_studio_booking: true });
	}

	return (
		<View style={styles.container}>
			<View style={styles.subContainer}>
				<View style={styles.contentContainer}>
					<View style={styles.textContainer}>
						<Text size="primaryMid" color="regular" style={styles.maxW65}>
							Need a Studio for your upcoming Project?
						</Text>
						<Calendar size="24" color="none" strokeWidth={3} strokeColor={theme.colors.typography} />
					</View>
					<Text size="bodyBig" color="regular">
						Book the finest Studios with Talent Grid.
					</Text>
				</View>
				<Pressable onPress={handleStudioBookingNavigation} style={styles.btn}>
					<Text size="button" color="primary" style={styles.btnText}>
						Book a Studio Now
					</Text>
					<View style={styles.icon}>
						<LongArrowRight size="24" color={theme.colors.black} />
					</View>
				</Pressable>
			</View>
		</View>
	);
}

const stylesheet = createStyleSheet(theme => ({
	container: { marginTop: 2 * theme.margins.base, paddingHorizontal: theme.padding.base, borderTopWidth: theme.borderWidth.slim, borderStyle: 'solid', borderBottomWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray },
	subContainer: { borderRightWidth: theme.borderWidth.slim, backgroundColor: theme.colors.backgroundLightBlack, borderLeftWidth: theme.borderWidth.slim, borderStyle: 'solid', borderColor: theme.colors.borderGray },
	contentContainer: { padding: theme.padding.base, gap: theme.gap.base },
	textContainer: { flexDirection: 'row', gap: theme.gap.base, justifyContent: 'space-between' },
	maxW65: { maxWidth: '65%' },
	btn: { flexDirection: 'row', alignItems: 'center', gap: theme.gap.base, justifyContent: 'space-between', borderTopWidth: theme.borderWidth.slim, borderColor: theme.colors.borderGray, borderStyle: 'solid' },
	btnText: { fontFamily: theme.fontFamily.cgMedium, paddingHorizontal: theme.padding.base },
	icon: { width: 52, height: 52, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
}));
