import { ReactNode, forwardRef } from 'react';
import { Text, View, ViewProps, Pressable, Platform } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useNavigation, useRoute } from '@react-navigation/native';
import { LongArrowLeft } from '@touchblack/icons';
import useHandleLogout from '@utils/signout';

interface IProps extends ViewProps {
	name: string;
	onPress?: () => void;
	icon?: ReactNode;
	main?: boolean;
	buttonContainerStyle?: any;
	onBackPressStepLogic?: () => boolean;
}

const Header = forwardRef<View, IProps>(({ name, onPress, main = true, icon: Icon = LongArrowLeft, ...props }, ref) => {
	const { styles, theme } = useStyles(stylesheet);
	const navigation = useNavigation();
	const logout = useHandleLogout(true);
	const route = useRoute();

	const handlePress = async () => {
		if (props.onBackPressStepLogic && props.onBackPressStepLogic()) {
			return;
		}
		if (onPress) {
			onPress();
			return;
		}
		const canGoBack = navigation.canGoBack();
		if (canGoBack) {
			navigation.goBack();
		} else {
			if (route.name === 'PersonalDetails') {
				return await logout();
			}
			navigation.navigate('TabNavigator');
		}
	};

	return (
		<View ref={ref} {...props} style={[styles.container, props.style]}>
			<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
				{main && (
					<Pressable style={styles.button} onPress={handlePress}>
						<Icon color={theme.colors.typography} size="24" />
					</Pressable>
				)}
				<Text numberOfLines={1} style={styles.heading}>
					{name}
				</Text>
				{props.children}
			</View>
		</View>
	);
});

export default Header;

const stylesheet = createStyleSheet(theme => ({
	container: {
		paddingHorizontal: theme.padding.base,
		...Platform.select({
			ios: {
				paddingBottom: theme.padding.sm,
			},
			android: {
				paddingVertical: theme.padding.sm,
			},
		}),
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	heading: {
		flex: 1,
		maxWidth: '80%',
		fontSize: theme.fontSize.primaryH2,
		color: theme.colors.typography,
		fontFamily: 'CabinetGrotesk-Medium',
	},
	subHeading: {
		fontSize: theme.fontSize.primaryH3,
		color: theme.colors.typographyLight,
	},
	buttonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	button: {
		marginLeft: 0,
		backgroundColor: theme.colors.transparent,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 4,
		paddingRight: theme.padding.sm,
	},
}));
