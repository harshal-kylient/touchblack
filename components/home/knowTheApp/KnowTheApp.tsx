import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Text } from '@touchblack/ui';
import { LongArrowRight } from '@touchblack/icons';
import { useNavigation } from '@react-navigation/native';

function KnowTheApp() {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();

	const handleRedirection = (index: number, heading: string,desc:string) => {
		if (index === 0) {
			navigation.navigate('FullScreenVideoPlayer', { header: heading,desc, });
		} else {
			navigation.navigate('FullScreenVideoPlayer', { header: heading,desc, });
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.knowTheAppTitleText} size="primaryMid" color="regular">
				Know the app
			</Text>
			<View style={styles.itemContainer}>
				{knowTheAppData.map((item, index) => {
					return (
						<View key={index} style={styles.item}>
							<View style={styles.body}>
								<Text size="primaryMid" style={[styles.textStyles, { flex: 1 }]}>
									{item.desc}
								</Text>
							</View>
							<TouchableOpacity style={styles.footer}  onPress={() => handleRedirection(index, item?.heading, item?.desc)} >
								<Text size="bodyBig" color="primary">
									{item.buttonLabel}
								</Text>
								<View style={styles.footerIcon}>
									<LongArrowRight color={theme.colors.black} size="24" />
								</View>
							</TouchableOpacity>
						</View>
					);
				})}
			</View>
		</View>
	);
}

export default KnowTheApp;

const stylesheet = createStyleSheet(theme => ({
	container: {
		width: '100%',
		gap: theme.gap.base,
		marginTop: 40,
	},
	knowTheAppTitleText: { paddingLeft: theme.padding.base },
	itemContainer: {
		borderColor: theme.colors.borderGray,
		borderTopWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		flexDirection: 'row',
		justifyContent: 'center',
		flex: 1,
		paddingHorizontal: theme.padding.base,
	},

	textStyles: {
		fontFamily: 'Cabinet Grotesk',
		fontSize: 22,
		fontWeight: '400',
		lineHeight: 32,
		color: '#FFFFFF',
		flex: 1,
	},
	item: {
		gap: theme.gap.base,
		justifyContent: 'space-between',
		backgroundColor: theme.colors.backgroundLightBlack,
		borderColor: theme.colors.borderGray,
		borderLeftWidth: theme.borderWidth.slim,
		borderRightWidth: theme.borderWidth.slim,
		borderBottomWidth: theme.borderWidth.slim,
		flex: 1,
	},
	body: {
		flex: 1,
		paddingHorizontal: theme.padding.base,
		paddingTop: theme.padding.base,
		gap: theme.gap.base,
	},
	footer: {
		justifyContent: 'space-between',
		borderTopColor: theme.colors.borderGray,
		borderWidth: theme.borderWidth.slim,
		paddingLeft: theme.padding.xs,
		alignItems: 'center',
		flexDirection: 'row',
	},
	footerIcon: {
		backgroundColor: theme.colors.primary,
		justifyContent: 'center',
		alignItems: 'center',
		maxWidth: 45,
		width: 45,
		height: 45,
	},
}));

const knowTheAppData = [
	{
		heading: 'Know the app',
		buttonLabel: 'View the demo',
		desc: 'What you can do as a Talent on Talent Grid',
	},
	{
		heading: 'Know the app',
		buttonLabel: 'View the demo',
		desc: 'How to organise your showreel',
	},
];
