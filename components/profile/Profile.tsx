import { SafeAreaView, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Text } from '@touchblack/ui';
import { ArrowDown } from '@touchblack/icons';
import { darkTheme } from '@touchblack/ui/theme';
import { SheetManager } from 'react-native-actions-sheet';
import { SheetType } from 'sheets';

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
		flexDirection: 'row',
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
}));

function Profile() {
	const { styles } = useStyles(stylesheet);

	const uploadPicture = () => {
		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.EditProfilePicture },
		});
	};

	const switchProfileDrawer = () => {
		SheetManager.show('Drawer', {
			payload: { sheet: SheetType.SwitchProfile },
		});
	};

	// const renderScene = ({ route }) => {
	//   switch (route.key) {
	//     case 'first':
	//       return <Films />;
	//     case 'second':
	//       return <BusinessDetails />;
	//     case 'third':
	//       return <Team />;
	//     default:
	//       return null;
	//   }
	// };

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor={darkTheme.colors.backgroundDarkBlack} />
			<View style={styles.subContainer}>
				<View style={styles.imgContainer}>
					<View style={styles.child}>
						<TouchableOpacity onPress={() => uploadPicture()}>
							<Image style={styles.imgStyl} source={require('../../../assets/svgs/profileDP.png')} alt="" />
							<View style={styles.editContainer}>
								<Text color="primary" size="primarySm" style={styles.icon}>
									pen
								</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.aboutContainer}>
						<TouchableOpacity onPress={() => switchProfileDrawer()} style={styles.switchContainer}>
							<Text color="regular" size="primaryMid" weight="regular">
								User Name
							</Text>
							<View style={styles.dropDown}>
								<ArrowDown color={darkTheme.colors.primary} size="24" strokeColor={darkTheme.colors.primary} />
							</View>
						</TouchableOpacity>
						<Text color="regular" size="primarySm" weight="regular">
							Harsh Rao
						</Text>
					</View>
				</View>
			</View>
			{/* <MyTabView
        sceneBgColor={darkTheme.colors.black}
        routeTab={[
          { key: 'first', title: 'Films' },
          { key: 'second', title: 'Business Details' },
          { key: 'third', title: 'Team' },
        ]}
        FirstRoute={Films}
        SecondRoute={BusinessDetails}
        ThirdRoute={Team}
        renderScene={renderScene}
      /> */}
		</SafeAreaView>
	);
}

export default Profile;
