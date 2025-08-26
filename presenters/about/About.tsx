import { View, Image, StatusBar, ScrollView } from 'react-native';
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { darkTheme } from '@touchblack/ui/theme';
import { CustomTabView } from '@components/CustomTabView';
import ShowReel from './Tabs/ShowReel';
import AboutTab from './Tabs/AboutTab';
import OtherWork from './Tabs/OtherWork';

function About() {
	const { styles } = useStyles(stylesheet);

	const renderScene = ({ route }: any) => {
		switch (route.key) {
			case 'first':
				return <ShowReel />;
			case 'second':
				return <AboutTab />;
			case 'third':
				return <OtherWork />;
			default:
				return null;
		}
	};

	return (
		<ScrollView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
			<View style={styles.subContainer}>
				<View style={styles.imgContainer}>
					<Image source={require('../../assets/svgs/About.png')} alt="" />
					<View style={styles.userDetailsContainer}>
						<View
							style={{
								paddingVertical: 12,
								paddingHorizontal: 16,
							}}>
							<Text color="regular" size="primarySm" weight="bold">
								User ANme Badge
							</Text>
							<Text color="regular" size="bodySm" weight="regular">
								Director | Mumbai
							</Text>
						</View>
						<View style={styles.iconContainer}>
							<Text style={{ paddingHorizontal: 18 }} color="black">
								ICon
							</Text>
							<View
								style={{
									height: '100%',
									width: 0.5,
									backgroundColor: 'black',
								}}
							/>
							<Text style={{ paddingHorizontal: 18 }} color="black">
								ICon
							</Text>
						</View>
					</View>
				</View>
			</View>
			<CustomTabView
				sceneBgColor={darkTheme.colors.black}
				routeTab={[
					{ key: 'first', title: 'Showreel' },
					{ key: 'second', title: 'About' },
					{ key: 'third', title: 'Other work' },
				]}
				FirstRoute={ShowReel}
				SecondRoute={AboutTab}
				ThirdRoute={OtherWork}
				renderScene={renderScene}
			/>
		</ScrollView>
	);
}

export default About;

const stylesheet = createStyleSheet(theme => ({
	container: {
		backgroundColor: theme.colors.backgroundDarkBlack,
		flex: 1,
		paddingBottom: 10,
	},
	subContainer: {
		marginTop: theme.margins.xxl,
		borderTopWidth: theme.borderWidth.bold,
		borderBottomWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		marginBottom: theme.margins.xxl,
	},
	imgContainer: {
		marginLeft: theme.margins.base,
		marginRight: theme.margins.xl,
		borderLeftWidth: theme.borderWidth.bold,
		borderRightWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
		maxHeight: 358,
		alignItems: 'center',
	},
	imgStyl: {
		maxHeight: 113,
		maxWidth: 113,
		position: 'relative',
	},
	child: {
		borderColor: theme.colors.borderGray,
		borderRightWidth: theme.borderWidth.bold,
	},
	editContainer: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		borderLeftWidth: theme.borderWidth.bold,
		borderTopWidth: theme.borderWidth.bold,
		borderColor: theme.colors.borderGray,
	},
	aboutContainer: {
		paddingHorizontal: theme.padding.base,
		paddingVertical: 26,
	},
	switchContainer: {
		flexDirection: 'row',
	},
	icon: {
		padding: theme.padding.xxs,
	},
	dropDown: {
		paddingLeft: theme.padding.xxs,
	},
	userDetailsContainer: {
		position: 'absolute',
		backgroundColor: theme.colors.borderGray,
		width: UnistylesRuntime.screen.width - 34,
		flexDirection: 'row',
		justifyContent: 'space-between',
		bottom: 0,
		opacity: 0.8,
	},
	iconContainer: {
		backgroundColor: theme.colors.primary,
		flexDirection: 'row',
		alignItems: 'center',
	},
}));
